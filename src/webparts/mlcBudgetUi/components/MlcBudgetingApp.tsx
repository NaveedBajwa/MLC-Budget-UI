import * as React from 'react';
import styles from './MlcBudgetingApp.module.scss';
import { IMlcBudgetingAppProps } from './IMlcBudgetingAppProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { TopAlert } from './Alert/TopAlert';
import { MiddleBody } from './Body/MiddleBody';
import { RightButtonSection } from './RightButtonSection/RightButtonSection';
import { ExpenseTableOE } from './ExpenseTable/ExpenseTableOE';
import { ExpenseTableMain } from './ExpenseTable/ExpenseTableMain';
import { ExpenseTablePage } from './ExpenseTablePage/ExpenseTablePage';
import { ExpenseForm } from './ExpenseForm/ExpenseForm';
import {Constants} from './Constants';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  ComboBox,
  DefaultButton,
  Fabric,
  IComboBoxOption,
  mergeStyleSets,
  SelectableOptionMenuItemType ,
  Toggle,
} from 'office-ui-fabric-react/lib/index';


export class IComboBoxOptionLoan implements IComboBoxOption
{
  public key: string;
  public text : string;
}


export interface IMlcBudgetingAppState {
  budgetCategoryText:string;
  budgetCategoryId:string;
  costCenterText:string;
  costCenterId:string;
  budgetYearId:string;
  budgetYearText:string;
  AccountCode:string;
  expenseInputEnabled:boolean;
  expenseInputView:boolean;
  itemCategoryId:string;
  BudgetCategoryOptions:IComboBoxOptionLoan[];
  CostCenterOptions:IComboBoxOptionLoan[];
  BudgetYearOptions:IComboBoxOptionLoan[];
  itemId:string;
  IsBudgetEnabled:boolean;
  IsCostCenterAssigned:boolean;
}

export default class MlcBudgetingApp extends React.Component<IMlcBudgetingAppProps, IMlcBudgetingAppState> {

  constructor(props: IMlcBudgetingAppProps) {
    super(props);

    let FirstBudgetCategoryID = "1";
    let FirstCostCenterID = "abc";
    this.getBudgetCategoryOptions = this.getBudgetCategoryOptions.bind(this);
    let BudgetCategoryOption:IComboBoxOptionLoan[] = [];
    let CostCenterOption:IComboBoxOptionLoan[] = [];
    let BudgetYearOption:IComboBoxOptionLoan[] = [];
    this.state = {IsCostCenterAssigned:true, IsBudgetEnabled:true, itemId:"0",budgetCategoryText:"Mashhead",budgetCategoryId:FirstBudgetCategoryID, costCenterText:"Main Cost Center", costCenterId:FirstCostCenterID, budgetYearId:"2021",
                    budgetYearText:"2021", expenseInputEnabled:true, expenseInputView:false, itemCategoryId:"1", AccountCode:"1", BudgetCategoryOptions:BudgetCategoryOption,
                    CostCenterOptions:CostCenterOption, BudgetYearOptions:BudgetYearOption};
 }

 public componentDidMount()
 {
  this.IsBudget();
  this.getFirstBudgetCategory();
  this.getFirstCostCenter();
  this.getBudgetCategoryOptions();

  this.getCostCenterOptions();

  //let CostCenterOption:IComboBoxOptionLoan[] = this.getCostCenterOptions();
  let BudgetYearOption:IComboBoxOptionLoan[] = this.getBudgetYearOptions();
  this.setState({BudgetYearOptions:BudgetYearOption}); 
 }

 public getBudgetYearOptions(): IComboBoxOptionLoan[]
 {
   
      let ComOptions:IComboBoxOptionLoan[] = [];
      let comOption = new IComboBoxOptionLoan();
      comOption.key = "2021"; 
      comOption.text = "2021";
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = "2020"; 
      comOption.text = "2020";
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = "2019"; 
      comOption.text = "2019";
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = "2018"; 
      comOption.text = "2018";
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = "2017"; 
      comOption.text = "2017";
      ComOptions = ComOptions.concat(comOption);

     return ComOptions;
 }

 public getFirstBudgetCategory() 
 {
   let i = "0";
   let response1 : any = this.GetBudgetcategoriesWSFirst().then(
     response => {
       response1 = response;
       response.map(itemY=>{

         if(i=="0")
         {
           i = itemY.expense_cat_id;
           this.setState({budgetCategoryId:i});
         }
     } 
       );
    }
   );
   
 }



 public async GetBudgetcategoriesWSFirst(): Promise<any[]> {
   let WSS = Constants.apiURL + '/GetAllExpenseCategories';
   try{
   return await this.props.budgetAppClient
   .get(WSS , AadHttpClient.configurations.v1)
   .then((response: HttpClientResponse) => {
     return response.json();
   })
   .then(jsonResponse => {
     return jsonResponse;
   }) as Promise<any>;
   } catch (e )
     {
       console.error(e);
       let i=0;
       //this.setState({hasError:true, dialogBoxMsg: "Something went wrong, Please refresh the page. If this happens again, please contact your administrator"});
     }
   }


 public getFirstCostCenter()
 {
   let i = "0"; 
   let innerCostCenterText = "";
   let response1 : any = this.GetCostCentreWSFirst().then(
     response => {
       response1 = response;
       response.map(itemY=>{
         if(i=="0")
         {
           i = itemY.cost_centre;
           if(itemY.desc_text != undefined)
           {
            innerCostCenterText = itemY.desc_text;
           }
           this.setState({costCenterId:i,costCenterText:innerCostCenterText});
         }
       }); 
       
     }
   );
   
 }

 public async GetCostCentreWSFirst(): Promise<any[]> {
   let WSS = Constants.apiURL + '/GetDistinctCostCentre';
   try{
   return await this.props.budgetAppClient
   .get(WSS , AadHttpClient.configurations.v1)
   .then((response: HttpClientResponse) => {
     return response.json();
   })
   .then(jsonResponse => {
     return jsonResponse;
   }) as Promise<any>;
   } catch (e )
     {
       console.error(e);
       let i=0;
       //this.setState({hasError:true, dialogBoxMsg: "Something went wrong, Please refresh the page. If this happens again, please contact your administrator"});
     }
   }


  public render(): React.ReactElement<IMlcBudgetingAppProps> {
    
    
    if(this.state.IsCostCenterAssigned == false)
    {
      return(
      <div>
        <table style={{width:"100%"}}>
          <tr style={{width:"100%"}}>
            <td style={{color:"red" ,width:"100%" }} align="center">
              <b>No cost center is assigned to you, please contact System Administrator </b>
            </td>
          </tr>
        </table>
      </div>);
    }

    if(this.state.IsBudgetEnabled == false)
    {
      return(
      <div>
        <table style={{width:"100%"}}>
          <tr style={{width:"100%"}}>
            <td style={{color:"red" ,width:"100%" }} align="center">
              <b>The Budget is closed, please contact System Administrator </b>
            </td>
          </tr>
        </table>
      </div>);
    }
    
    if(this.state.expenseInputView==false)
    {
      return (
        <div className={ styles.mlcBudgetingApp }>
          
          <ExpenseTablePage budgetCategoryText={this.state.budgetCategoryText} budgetCategoryId={this.state.budgetCategoryId} costCenterText={this.state.costCenterText}
            costCenterId={this.state.costCenterId} budgetYearId={"2021"} budgetYearText={this.state.budgetYearText} OnBudgetCategoryChange={this.OnBudgetCategoryChange.bind(this)}
            OnChangeCostCenter={this.OnChangeCostCenter.bind(this)} OnChangeYear={this.OnChangeYear.bind(this)} OnChangeExpenseInputView={this.OnChangeExpenseInputView.bind(this)} 
            OnChangeitemCategoryId={this.OnChangeitemCategoryId.bind(this)} budgetAppClient={this.props.budgetAppClient} context={this.props.context} 
            BudgetCategoryOptions={this.state.BudgetCategoryOptions} CostCenterOptions={this.state.CostCenterOptions}  BudgetYearOptions={this.state.BudgetYearOptions}            
            />
        </div>
      );
    }
    else
    {
      return (
        <div className={ styles.mlcBudgetingApp }>
          <ExpenseForm OnChangeItemId={this.OnChangeItemId.bind(this)}   itemId={this.state.itemId} budgetCategoryText={this.state.budgetCategoryText} budgetCategoryId={this.state.budgetCategoryId} costCenterText={this.state.costCenterText}
            costCenterId={this.state.costCenterId} budgetYearId={"2021"} budgetYearText={this.state.budgetYearText} OnBudgetCategoryChange={this.OnBudgetCategoryChange.bind(this)}
            OnChangeCostCenter={this.OnChangeCostCenter.bind(this)} OnChangeYear={this.OnChangeYear.bind(this)} OnChangeExpenseInputView={this.OnChangeExpenseInputView.bind(this)} 
            OnChangeitemCategoryId={this.OnChangeitemCategoryId.bind(this)} budgetAppClient={this.props.budgetAppClient} context={this.props.context} itemCategoryId={this.state.itemCategoryId} 
            BudgetCategoryOptions={this.state.BudgetCategoryOptions} CostCenterOptions={this.state.CostCenterOptions}  BudgetYearOptions={this.state.BudgetYearOptions}
            />

        </div>
      );
      
    }
  }

  public OnBudgetCategoryChange(selectedCategoryId:string,selectedBudgetcategoryText:string)
  {
    //if(selectedBudgetcategoryText !== undefined)
    //{
    //  this.setState({budgetCategoryId:selectedCategoryId,budgetCategoryText:selectedBudgetcategoryText});
    //}
    //else 
    //{
      this.setState({budgetCategoryId:selectedCategoryId,itemId:'0'});
    //}
    
  }

  public OnChangeCostCenter(selectedCostCenterCategoryId:string,selectedCostCenterText:string)
  {
    this.setState({costCenterId:selectedCostCenterCategoryId,costCenterText:selectedCostCenterText});
  }

  public OnChangeYear(selectedbudgetYearId:string,selectedbudgetYearText:string)
  {
    this.setState({budgetYearId:selectedbudgetYearId,budgetYearText:selectedbudgetYearText});
  }

  public OnChangeExpenseInputView(updatedexpenseInputView:boolean, AccountCode:string,ItemId:string)
  {
    if(ItemId == null)
    {
      ItemId = "0";
    }
    this.setState({expenseInputView:updatedexpenseInputView, AccountCode:AccountCode, itemCategoryId:AccountCode,itemId:ItemId});
  }

  public OnChangeExpenseInputEnabled(updatedexpenseInputEnabled:boolean)
  {
    this.setState({expenseInputEnabled:updatedexpenseInputEnabled});
  }

  public OnChangeItemId(ItemId:string)
  {
    this.setState({itemId:ItemId});
  }

  public OnChangeitemCategoryId(seletedItemCategoryId:string)
  {
    this.setState({itemCategoryId:seletedItemCategoryId,itemId:'0'});
  }

  public getBudgetCategoryOptions(): IComboBoxOptionLoan[]
  {
    let BClist:any =[];
    let ComOptions:IComboBoxOptionLoan[] = [];
    let i="0";
    let response1 : any = this.GetBudgetcategoriesWS().then(
      response => {
        response1 = response;
        response.map(itemY=>{

          let comOption = new IComboBoxOptionLoan();
          if(i=="0")
          {
            i = itemY.expense_cat_id;
          }
          comOption.key = itemY.expense_cat_id; 
          comOption.text = itemY.expense_cat;
          ComOptions = ComOptions.concat(comOption);
        }); 
        this.setState({budgetCategoryId:i, BudgetCategoryOptions: ComOptions});
        
      }
    );
    return ComOptions;
  }


  public async GetBudgetcategoriesWS(): Promise<any[]> {
    let WSS = Constants.apiURL + '/GetAllExpenseCategories';
    try{
    return await this.props.budgetAppClient
    .get(WSS , AadHttpClient.configurations.v1)
    .then((response: HttpClientResponse) => {
      return response.json();
    })
    .then(jsonResponse => {
      return jsonResponse;
    }) as Promise<any>;
    } catch (e )
      {
        console.error(e);
        let i=0;
        //this.setState({hasError:true, dialogBoxMsg: "Something went wrong, Please refresh the page. If this happens again, please contact your administrator"});
      }
    }


  public getCostCenterOptions(): IComboBoxOptionLoan[]
  {
    
    let BClist:any =[];
    let ComOptions:IComboBoxOptionLoan[] = [];
    let i="0";
    let response1 : any = this.GetCostCentreWS().then(
      response => {
        response1 = response;
        if(response.length == 0)
        {
          this.setState({IsCostCenterAssigned:false});
          return ComOptions;
        }
        response.map(itemY=>{
          let comOption = new IComboBoxOptionLoan();
          if(i=="0")
          {
            i = itemY.cost_centre;
          }
          comOption.key = itemY.cost_centre; 
          comOption.text = itemY.desc_text;
          ComOptions = ComOptions.concat(comOption);
        }); 
        this.setState({costCenterId:i, CostCenterOptions: ComOptions,IsCostCenterAssigned:true});
        
      }
    );
    return ComOptions;
  }

  public async GetCostCentreWS(): Promise<any[]> {
    let WSS = Constants.apiURL + '/GetDistinctCostCentre';
    try{
    return await this.props.budgetAppClient
    .get(WSS , AadHttpClient.configurations.v1)
    .then((response: HttpClientResponse) => {
      return response.json();
    })
    .then(jsonResponse => {
      return jsonResponse;
    }) as Promise<any>;
    } catch (e )
      {
        console.error(e);
        let i=0;
        //this.setState({hasError:true, dialogBoxMsg: "Something went wrong, Please refresh the page. If this happens again, please contact your administrator"});
      }
    }

    public IsBudget()
  {
    
    let response1 : any = this.IsBudgetWS().then(
      response => {
        response1 = response;
          this.setState({IsBudgetEnabled:response1});
      }
    );
  }

  public async IsBudgetWS(): Promise<any[]> {
    let WSS = Constants.apiURL + '/IsBudgetOn';
    try{
    return await this.props.budgetAppClient
    .get(WSS , AadHttpClient.configurations.v1)
    .then((response: HttpClientResponse) => {
      return response.json();
    })
    .then(jsonResponse => {
      return jsonResponse;
    }) as Promise<any>;
    } catch (e )
      {
        console.error(e);
        let i=0;
        //this.setState({hasError:true, dialogBoxMsg: "Something went wrong, Please refresh the page. If this happens again, please contact your administrator"});
      }
    }


}



