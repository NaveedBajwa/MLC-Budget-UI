
import * as React from 'react';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { ITheme, getTheme, getFocusStyle } from 'office-ui-fabric-react/lib/Styling';
//import { createListItems, IExampleItem } from '@uifabric/example-data';
import {  PrimaryButton, Stack, IStackTokens } from 'office-ui-fabric-react';
import NumberFormat from 'react-number-format';
import { escape } from '@microsoft/sp-lodash-subset';
import {
  ComboBox,
  DefaultButton,
  Fabric,
  IComboBoxOption,
  mergeStyleSets,
  SelectableOptionMenuItemType ,
  Toggle,
} from 'office-ui-fabric-react/lib/index';
import { ContextualMenu } from 'office-ui-fabric-react/lib/ContextualMenu';
import { hiddenContentStyle, mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { useBoolean } from '@uifabric/react-hooks';
import {
  HttpClient,
} from '@microsoft/sp-http';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Constants } from '../../components/Constants';


export interface IMiddleBodyProps {
  
  budgetCategoryText:string;
  budgetCategoryId:string;
  costCenterText:string;
  costCenterId:string;
  budgetYearId:string;
  budgetYearText:string;
  OnBudgetCategoryChange : Function;
  OnChangeCostCenter: Function;
  OnChangeBudgetYear: Function;
  budgetAppClient : AadHttpClient;
  context: WebPartContext;
BudgetCategoryOptions:IComboBoxOptionLoan[];
CostCenterOptions:IComboBoxOptionLoan[];
BudgetYearOptions:IComboBoxOptionLoan[];

}

export interface IMiddleBodyState {
  
  budgetCategoryText:string;
  budgetCategoryId:string;
  costCenterText:string;
  costCenterId:string;
  budgetYearId:string;
  budgetYearText:string;
  BudgetCategoryOptions:IComboBoxOptionLoan[];
  CostCenterOptions:IComboBoxOptionLoan[];
  BudgetYearOptions:IComboBoxOptionLoan[];
}

export class IComboBoxOptionLoan implements IComboBoxOption
    {
      public key: string;
      public text : string;
    }


export class MiddleBody extends React.Component<IMiddleBodyProps, IMiddleBodyState> {
  
  constructor(props: IMiddleBodyProps) {
    super(props);
    //this.getBudgetCategoryOptions = this.getBudgetCategoryOptions.bind(this);
    let BudgetCategoryOption:IComboBoxOptionLoan[] = this.props.BudgetCategoryOptions;
    let CostCenterOption:IComboBoxOptionLoan[] = this.props.CostCenterOptions;
    let BudgetYearOption:IComboBoxOptionLoan[] = this.props.BudgetYearOptions;

    this.state = {budgetCategoryText:this.props.budgetCategoryText, budgetCategoryId:this.props.budgetCategoryId,  costCenterText:this.props.costCenterText,
      costCenterId:this.props.costCenterId, budgetYearId:this.props.budgetYearId,  budgetYearText:this.props.budgetYearText, BudgetCategoryOptions:BudgetCategoryOption,
      CostCenterOptions:CostCenterOption, BudgetYearOptions:BudgetYearOption
    };
    
  }

  public render(): JSX.Element {
    if(this.props.budgetYearText != this.state.budgetYearText || this.props.budgetCategoryText != this.state.budgetCategoryText || this.props.budgetCategoryId != this.state.budgetCategoryId
        || this.props.costCenterId != this.state.costCenterId || this.props.budgetCategoryId != this.state.budgetCategoryId )
        {
          this.setState({budgetYearText: this.props.budgetYearText, budgetCategoryText: this.props.budgetCategoryText,budgetCategoryId :this.props.budgetCategoryId,
            costCenterId : this.props.costCenterId, costCenterText:this.props.costCenterText});
        }
   
    return (
              <table style={{width:"100%"}}>
                <tr>
                  <td colSpan={3}>
                    <h2>
                      {this.state.budgetYearText}&nbsp;Finance Budget Submissions:&nbsp;{this.state.costCenterText} 
                    </h2>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table>
                          <tr>
                            <td>
                              <b>
                              Budget Category:
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <b>
                               <ComboBox
                                label=""
                                key={'BudgetCategory'}
                                allowFreeform={true}
                                autoComplete={true ? 'on' : 'off'}
                                options={this.props.BudgetCategoryOptions}
                                selectedKey={this.state.budgetCategoryId}
                                onChange={this.OnBudgetCategoryChangeInner.bind(this)}
                              />
                            </b>
                          </td>
                        </tr>
                      </table>
                  </td>
                  <td>
                    <table>
                      <tr>
                        <td>
                          <b>
                            Cost Centre:
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>
                           <ComboBox
                            key={'CostCenter'}
                            allowFreeform={true}
                            autoComplete={true ? 'on' : 'off'}
                            options={this.props.CostCenterOptions}
                            selectedKey={this.state.costCenterId}
                          onChange={this.OnCostCentreChangeInner.bind(this)}                  
                          />
                          </b>
                        </td>
                      </tr>
                    </table>
                  </td>
                  
                  <td>
                  <table>
                          <tr>
                            <td>
                              <b>
                              Budget Year:
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <b>
                               <ComboBox
                                label=""
                                key={'BudgetYear'}
                                allowFreeform={true}
                                autoComplete={true ? 'on' : 'off'}
                                options={this.props.BudgetYearOptions}
                                selectedKey={this.state.budgetYearText}
                                onChange={this.OnBudgetYearChangeInner.bind(this)}
                              />
                          </b>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
      );
  }

  public componentDidMount() {
    //this.getBudgetCategoryOptions();
    //this.getCostCenterOptions();
    //let CostCenterOption:IComboBoxOptionLoan[] = this.getCostCenterOptions();
    //let BudgetYearOption:IComboBoxOptionLoan[] = this.getBudgetYearOptions();
    //this.setState({BudgetYearOptions:BudgetYearOption}); 
  }


  public OnBudgetCategoryChangeInner(evt,Cmb_Selected)
  {
    let selectedText = Cmb_Selected.text;
    this.props.OnBudgetCategoryChange(Cmb_Selected.key,selectedText);
  }

  public OnCostCentreChangeInner(evt,Cmb_Selected)
  {
    let selectedText = Cmb_Selected.text;
    this.props.OnChangeCostCenter(Cmb_Selected.key,selectedText);
  }
  
  public OnBudgetYearChangeInner(evt,Cmb_Selected)
  {
    let selectedText = Cmb_Selected.text;
    this.props.OnChangeBudgetYear(Cmb_Selected.key,selectedText);
  }
/*
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
        this.setState({costCenterId:i, CostCenterOptions: ComOptions});
        
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
  */

}
