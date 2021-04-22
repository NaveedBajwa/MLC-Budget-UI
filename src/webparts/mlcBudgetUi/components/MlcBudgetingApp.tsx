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
  BoldText:string;
  CurrentBudgetYear:string;
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
    this.state = {CurrentBudgetYear:"", BoldText:"",IsCostCenterAssigned:true, IsBudgetEnabled:true, itemId:"0",budgetCategoryText:"Mashhead",budgetCategoryId:FirstBudgetCategoryID, costCenterText:"Main Cost Center", costCenterId:FirstCostCenterID, budgetYearId:"2022",
                    budgetYearText:"2022", expenseInputEnabled:true, expenseInputView:false, itemCategoryId:"1", AccountCode:"1", BudgetCategoryOptions:BudgetCategoryOption,
                    CostCenterOptions:CostCenterOption, BudgetYearOptions:BudgetYearOption};
 }

 public componentDidMount()
 {
  this.getApprovedBudgetYear();
  this.IsBudget();
  this.getNonBoldAlert();
  this.getFirstBudgetCategory();
  this.getFirstCostCenter();
  this.getBudgetCategoryOptions();
  this.getCostCenterOptions();

  //let CostCenterOption:IComboBoxOptionLoan[] = this.getCostCenterOptions();
  //let BudgetYearOption:IComboBoxOptionLoan[] = this.getBudgetYearOptions();
  //this.setState({BudgetYearOptions:BudgetYearOption}); 
 }

 public getBudgetYearOptions(): IComboBoxOptionLoan[]
 {
      let int_CurrentBudgetYear = parseInt(this.state.CurrentBudgetYear);
      let ComOptions:IComboBoxOptionLoan[] = [];
      let comOption = new IComboBoxOptionLoan();
      comOption = new IComboBoxOptionLoan();
      comOption.key = int_CurrentBudgetYear.toString(); 
      comOption.text = int_CurrentBudgetYear.toString();
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = (int_CurrentBudgetYear-1).toString(); 
      comOption.text = (int_CurrentBudgetYear-1).toString(); 
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = (int_CurrentBudgetYear-2).toString();  
      comOption.text = (int_CurrentBudgetYear-2).toString(); 
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = (int_CurrentBudgetYear-3).toString();  
      comOption.text = (int_CurrentBudgetYear-3).toString(); 
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = (int_CurrentBudgetYear-4).toString();  
      comOption.text = (int_CurrentBudgetYear-4).toString(); 
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = (int_CurrentBudgetYear-5).toString();  
      comOption.text = (int_CurrentBudgetYear-5).toString(); 
      ComOptions = ComOptions.concat(comOption);

     return ComOptions;
 }

 public getApprovedBudgetYear() 
 {
   let i = "0";
   let response1 : any = this.getApprovedBudgetYearWS().then(
     response => {
       response1 = response;
       let int_CurrentBudgetYear = parseInt(response1);
      let ComOptions:IComboBoxOptionLoan[] = [];
      let comOption = new IComboBoxOptionLoan();
      comOption = new IComboBoxOptionLoan();
      comOption.key =response1.toString(); 
      comOption.text =response1.toString();
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = (response1-1).toString(); 
      comOption.text = (int_CurrentBudgetYear-1).toString(); 
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = (int_CurrentBudgetYear-2).toString();  
      comOption.text = (int_CurrentBudgetYear-2).toString(); 
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = (int_CurrentBudgetYear-3).toString();  
      comOption.text = (int_CurrentBudgetYear-3).toString(); 
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = (int_CurrentBudgetYear-4).toString();  
      comOption.text = (int_CurrentBudgetYear-4).toString(); 
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = (int_CurrentBudgetYear-5).toString();  
      comOption.text = (int_CurrentBudgetYear-5).toString(); 
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = (int_CurrentBudgetYear-6).toString();  
      comOption.text = (int_CurrentBudgetYear-6).toString(); 
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = (int_CurrentBudgetYear-7).toString();  
      comOption.text = (int_CurrentBudgetYear-7).toString(); 
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = (int_CurrentBudgetYear-8).toString();  
      comOption.text = (int_CurrentBudgetYear-8).toString(); 
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = (int_CurrentBudgetYear-9).toString();  
      comOption.text = (int_CurrentBudgetYear-9).toString(); 
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = (int_CurrentBudgetYear-10).toString();  
      comOption.text = (int_CurrentBudgetYear-10).toString(); 
      ComOptions = ComOptions.concat(comOption);
      this.setState({BudgetYearOptions:ComOptions, CurrentBudgetYear:response1,budgetYearText:response1, budgetYearId:response1});
       
     } 
       );
 }



 public async getApprovedBudgetYearWS(): Promise<any[]> {
   let WSS = Constants.apiURL + '/GetAllowedBudgetYear';
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
        <table style={{backgroundColor:"#f3565d",color:"white", width:"100%" }}>
            <tr style={{backgroundColor:"#f3565d",color:"white", width:"100%" }}>
              <td style={{backgroundColor:"#f3565d",color:"white", width:"100%",padding:"10px" }}>
                <b>
                 The Finance System indicates that you do not have responsibility for any faculty budgets. As a result, there is no information to display. <br/>If you feel you should have access to these resources, please contact Louisa Johnstone on ext 6318.
                </b>
              </td>
            </tr>
          </table>
      </div>);
    }

    if(this.state.IsBudgetEnabled == false)
    {
      return(
      <div>
        <table style={{backgroundColor:"#f3565d",color:"white", width:"100%" }}>
            <tr style={{backgroundColor:"#f3565d",color:"white", width:"100%" }}>
              <td style={{backgroundColor:"#f3565d",color:"white", width:"100%",padding:"10px" }}>
                <b>
                {this.state.BoldText}
                </b>
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
            costCenterId={this.state.costCenterId} budgetYearId={this.state.budgetYearText} budgetYearText={this.state.budgetYearText} OnBudgetCategoryChange={this.OnBudgetCategoryChange.bind(this)}
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
            costCenterId={this.state.costCenterId} budgetYearId={this.state.budgetYearText} budgetYearText={this.state.budgetYearText} OnBudgetCategoryChange={this.OnBudgetCategoryChange.bind(this)}
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


    public getNonBoldAlert(): string
    {

      let i="0";
      
      let response1 : any = this.getNonBoldAlertWS().then(
        response => {
          response1 = response;
          i = response.toString();
          this.setState({ BoldText:i});
          }); 
          //this.setState({Notes:i});
      return i;
    }
  
  
    public async getNonBoldAlertWS(): Promise<any[]> {
      let WSS ="";
      WSS = Constants.apiURL + '/GetNonBoldAlert';
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



