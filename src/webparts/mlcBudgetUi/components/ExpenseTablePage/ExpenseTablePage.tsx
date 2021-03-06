
import * as React from 'react';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { ITheme, getTheme, getFocusStyle } from 'office-ui-fabric-react/lib/Styling';
//import { createListItems, IExampleItem } from '@uifabric/example-data';
import {  PrimaryButton, Stack, IStackTokens } from 'office-ui-fabric-react';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
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

import { TopAlert } from '../Alert/TopAlert';
import { MiddleBody } from '../Body/MiddleBody';
import { RightButtonSection } from '../RightButtonSection/RightButtonSection';
import { ExpenseTableMain } from '../ExpenseTable/ExpenseTableMain';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Constants } from '../Constants';




export interface IExpenseTablePageProps {
  budgetCategoryText:string;
  budgetCategoryId:string;
  costCenterText:string;
  costCenterId:string;
  budgetYearId:string;
  budgetYearText:string;
  OnBudgetCategoryChange:Function;
  OnChangeCostCenter:Function;
  OnChangeYear:Function;
  OnChangeExpenseInputView:Function;
  OnChangeitemCategoryId:Function;
  budgetAppClient : AadHttpClient;
  context: WebPartContext;
  BudgetCategoryOptions:IComboBoxOptionLoan[];
  CostCenterOptions:IComboBoxOptionLoan[];
  BudgetYearOptions:IComboBoxOptionLoan[];
}

export interface IExpenseTablePageState {
  budgetCategoryText:string;
  budgetCategoryId:string;
  costCenterText:string;
  costCenterId:string;
  budgetYearId:string;
  budgetYearText:string;
  itemCategoryId:string;
  NonBoldAlert:string;
  BoldAlert:string;
}

export class IComboBoxOptionLoan implements IComboBoxOption
    {
      public key: string;
      public text : string;
    }


export class ExpenseTablePage extends React.Component<IExpenseTablePageProps, IExpenseTablePageState> {
  
  constructor(props: IExpenseTablePageProps) {
    super(props);
    this.state = { NonBoldAlert:"", BoldAlert:"",  budgetCategoryText:this.props.budgetCategoryText, budgetCategoryId:this.props.budgetCategoryId, costCenterText:this.props.costCenterText,
                      costCenterId:this.props.costCenterId, budgetYearId:this.props.budgetYearId, budgetYearText:this.props.budgetYearText,itemCategoryId:"" };
  }

  public componentDidMount()
  {
    this.getBoldAlert();
    this.getNonBoldAlert();
  }

  public render(): JSX.Element {
    return(
          <table style={{width:"100%"}}>
          <tr>
          <td colSpan={2}>
          <TopAlert alertText={this.state.NonBoldAlert} 
            boldText={this.state.BoldAlert} />
            </td>
          </tr>
          <tr>
            <td style={{width:"75%"}}>
            <MiddleBody OnChangeBudgetYear={this.props.OnChangeYear.bind(this)}  OnChangeCostCenter={this.props.OnChangeCostCenter.bind(this)} budgetAppClient={this.props.budgetAppClient} context={this.props.context}  OnBudgetCategoryChange={this.props.OnBudgetCategoryChange.bind(this)} budgetCategoryId={this.props.budgetCategoryId} budgetYearId={this.props.budgetYearId} budgetCategoryText={this.props.budgetCategoryText} 
              budgetYearText={this.props.budgetYearText} costCenterId={this.props.costCenterId} costCenterText={this.props.costCenterText}
              BudgetCategoryOptions={this.props.BudgetCategoryOptions} CostCenterOptions={this.props.CostCenterOptions}  BudgetYearOptions={this.props.BudgetYearOptions}  />
            </td>
            <td style={{width:"25%"}}>
              <RightButtonSection budgetCategoryId={this.props.budgetCategoryId} costCenterId={this.props.costCenterId} budgetYearId={this.props.budgetYearText} 
               budgetAppClient={this.props.budgetAppClient} context={this.props.context} />
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{fontSize:12,color:"#232323"}}>
            Please click an expense item from the table below to add/edit/delete items belonging to that expense.
              </td>
          </tr>
          <tr style={{width:"100%"}}>
            <td colSpan={2}>
              <ExpenseTableMain TableData={[]} Table={this.props.budgetCategoryId} budgetCategoryText={this.props.budgetCategoryText} budgetCategoryId={this.props.budgetCategoryId} costCenterText={this.props.costCenterText}
            costCenterId={this.props.costCenterId} budgetYearId={this.props.budgetYearId} budgetYearText={this.props.budgetYearText} OnBudgetCategoryChange={this.props.OnBudgetCategoryChange.bind(this)}
            OnChangeCostCenter={this.props.OnChangeCostCenter.bind(this)} OnChangeYear={this.props.OnChangeYear.bind(this)} OnChangeExpenseInputView={this.props.OnChangeExpenseInputView.bind(this)} 
            OnChangeitemCategoryId={this.props.OnChangeitemCategoryId.bind(this)} budgetAppClient={this.props.budgetAppClient} context={this.props.context}   />
            </td>
          </tr>
        </table>
    
      );

    }

    public getBoldAlert(): string
        {
  
          let i="0";
          
          let response1 : any = this.getBoldAlertWS().then(
            response => {
              response1 = response;
              i = response.toString();
              this.setState({ BoldAlert:i});
              }); 
              //this.setState({Notes:i});
          return i;
        }
      
      
        public async getBoldAlertWS(): Promise<any[]> {
          let WSS ="";
          WSS = Constants.apiURL + '/GetBoldAlert';
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
                this.setState({ NonBoldAlert:i});
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
    /*
    public OnBudgetCategoryChange(selectedCategoryId:string,selectedBudgetcategoryText:string)
    {
      this.setState({budgetCategoryId:selectedCategoryId,budgetCategoryText:selectedBudgetcategoryText});
    }
  
    public OnChangeCostCenter(selectedCostCenterCategoryId:string,selectedCostCenterText:string)
    {
      this.setState({costCenterId:selectedCostCenterCategoryId,costCenterText:selectedCostCenterText});
    }
  
    public OnChangeYear(selectedbudgetYearId:string,selectedbudgetYearText:string)
    {
      this.setState({budgetYearId:selectedbudgetYearId,budgetYearText:selectedbudgetYearText});
    }
    */
}
