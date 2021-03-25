
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
}

export class IComboBoxOptionLoan implements IComboBoxOption
    {
      public key: string;
      public text : string;
    }


export class ExpenseTablePage extends React.Component<IExpenseTablePageProps, IExpenseTablePageState> {
  
  constructor(props: IExpenseTablePageProps) {
    super(props);
    this.state = {  budgetCategoryText:this.props.budgetCategoryText, budgetCategoryId:this.props.budgetCategoryId, costCenterText:this.props.costCenterText,
                      costCenterId:this.props.costCenterId, budgetYearId:this.props.budgetYearId, budgetYearText:this.props.budgetYearText,itemCategoryId:"" };
  }

  public render(): JSX.Element {
    return(
          <table style={{width:"100%"}}>
          <tr>
          <td colSpan={2}>
          <TopAlert alertText="Salary budget and photocopying/printing figures are pre-populated." 
            boldText="Do not enter any salaries and photocopying/printing values in this system." />
            </td>
          </tr>
          <tr>
            <td style={{width:"75%"}}>
            <MiddleBody OnChangeBudgetYear={this.props.OnChangeYear.bind(this)}  OnChangeCostCenter={this.props.OnChangeCostCenter.bind(this)} budgetAppClient={this.props.budgetAppClient} context={this.props.context}  OnBudgetCategoryChange={this.props.OnBudgetCategoryChange.bind(this)} budgetCategoryId={this.props.budgetCategoryId} budgetYearId={this.props.budgetYearId} budgetCategoryText={this.props.budgetCategoryText} 
              budgetYearText={this.props.budgetYearText} costCenterId={this.props.costCenterId} costCenterText={this.props.costCenterText}
              BudgetCategoryOptions={this.props.BudgetCategoryOptions} CostCenterOptions={this.props.CostCenterOptions}  BudgetYearOptions={this.props.BudgetYearOptions}  />
            </td>
            <td style={{width:"25%"}}>
              <RightButtonSection budgetCategoryId={this.props.budgetCategoryId} costCenterId={this.props.costCenterId} budgetYearId={this.props.budgetYearId} 
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
