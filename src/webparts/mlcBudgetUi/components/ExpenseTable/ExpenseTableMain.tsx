
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
  HttpClientResponse
} from '@microsoft/sp-http';
import { ExpenseTableOE } from './ExpenseTableOE';
import { ExpenseTableBM } from './ExpenseTableBM';
import { ExpenseTableSL } from './ExpenseTableSL';
import { ExpenseTableTC } from './ExpenseTableTC';
import { ExpenseTableFA } from './ExpenseTableFA';
import { AadHttpClient} from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Constants } from '../../components/Constants';



export interface IExpenseTableMainProps {
  TableData:any[];
  Table:string;
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
}

export interface IExpenseTableMainState {
  TableData:any[];
  Table:string;
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


export class ExpenseTableMain extends React.Component<IExpenseTableMainProps, IExpenseTableMainState> {
  
  constructor(props: IExpenseTableMainProps) {
    super(props);
    this.state = { TableData:[], Table:this.props.budgetCategoryId,  budgetCategoryText:this.props.budgetCategoryText, budgetCategoryId:this.props.budgetCategoryId, 
      costCenterText:this.props.costCenterText,costCenterId:this.props.costCenterId, budgetYearId:this.props.budgetYearId, 
      budgetYearText:this.props.budgetYearText,itemCategoryId:"1" };
  }

  public render(): JSX.Element {
    
    if(this.props.budgetCategoryId == "1")
    {
      return (
        <tr>
        <td colSpan={2} style={{width:"100%"}}>
          <ExpenseTableOE budgetAppClient={this.props.budgetAppClient} context={this.props.context}  budgetCategoryText={this.props.budgetCategoryText} budgetCategoryId={this.props.budgetCategoryId} costCenterText={this.props.costCenterText}
            costCenterId={this.props.costCenterId} budgetYearId={this.props.costCenterText} budgetYearText={this.props.budgetYearText} OnBudgetCategoryChange={this.props.OnBudgetCategoryChange.bind(this)}
            OnChangeCostCenter={this.props.OnChangeCostCenter.bind(this)} OnChangeYear={this.props.OnChangeYear.bind(this)} OnChangeExpenseInputView={this.props.OnChangeExpenseInputView.bind(this)} 
            OnChangeitemCategoryId={this.props.OnChangeitemCategoryId.bind(this)}  />
        </td>
      </tr>
      );
    }
    else if(this.props.budgetCategoryId == "2")
    {
      return (
        <table style={{width:"100%"}}>
          <tr>
          <td colSpan={2}>
            <ExpenseTableBM budgetAppClient={this.props.budgetAppClient} context={this.props.context}  budgetCategoryText={this.props.budgetCategoryText} budgetCategoryId={this.props.budgetCategoryId} costCenterText={this.props.costCenterText}
              costCenterId={this.props.costCenterId} budgetYearId={this.props.costCenterText} budgetYearText={this.props.budgetYearText} OnBudgetCategoryChange={this.props.OnBudgetCategoryChange.bind(this)}
              OnChangeCostCenter={this.props.OnChangeCostCenter.bind(this)} OnChangeYear={this.props.OnChangeYear.bind(this)} OnChangeExpenseInputView={this.props.OnChangeExpenseInputView.bind(this)} 
              OnChangeitemCategoryId={this.props.OnChangeitemCategoryId.bind(this)} />
          </td>
        </tr>
      </table>
      );

    }

    else if(this.props.budgetCategoryId == "3")
    {
      return (
      <table style={{width:"100%"}}>
      <tr>
        <td colSpan={2}>
          <ExpenseTableSL budgetAppClient={this.props.budgetAppClient} context={this.props.context}  budgetCategoryText={this.props.budgetCategoryText} budgetCategoryId={this.props.budgetCategoryId} costCenterText={this.props.costCenterText}
            costCenterId={this.props.costCenterId} budgetYearId={this.props.costCenterText} budgetYearText={this.props.budgetYearText} OnBudgetCategoryChange={this.props.OnBudgetCategoryChange.bind(this)}
            OnChangeCostCenter={this.props.OnChangeCostCenter.bind(this)} OnChangeYear={this.props.OnChangeYear.bind(this)} OnChangeExpenseInputView={this.props.OnChangeExpenseInputView.bind(this)} 
            OnChangeitemCategoryId={this.props.OnChangeitemCategoryId.bind(this)} />
        </td>
      </tr>
      </table>
      );

    }
    
    else if(this.props.budgetCategoryId == "4")
    {
      return (
      <table style={{width:"100%"}}>
      <tr>
        <td colSpan={2}>
          <ExpenseTableTC budgetAppClient={this.props.budgetAppClient} context={this.props.context}  budgetCategoryText={this.props.budgetCategoryText} budgetCategoryId={this.props.budgetCategoryId} costCenterText={this.props.costCenterText}
            costCenterId={this.props.costCenterId} budgetYearId={this.props.costCenterText} budgetYearText={this.props.budgetYearText} OnBudgetCategoryChange={this.props.OnBudgetCategoryChange.bind(this)}
            OnChangeCostCenter={this.props.OnChangeCostCenter.bind(this)} OnChangeYear={this.props.OnChangeYear.bind(this)} OnChangeExpenseInputView={this.props.OnChangeExpenseInputView.bind(this)} 
            OnChangeitemCategoryId={this.props.OnChangeitemCategoryId.bind(this)}  />
        </td>
      </tr>
      </table>
      );

    }
    
    else if(this.props.budgetCategoryId == "5")
    {
      return (
      <table style={{width:"100%"}}>
      <tr>
        <td colSpan={2}>
          <ExpenseTableFA budgetAppClient={this.props.budgetAppClient} context={this.props.context}  budgetCategoryText={this.props.budgetCategoryText} budgetCategoryId={this.props.budgetCategoryId} costCenterText={this.props.costCenterText}
            costCenterId={this.props.costCenterId} budgetYearId={this.props.costCenterText} budgetYearText={this.props.budgetYearText} OnBudgetCategoryChange={this.props.OnBudgetCategoryChange.bind(this)}
            OnChangeCostCenter={this.props.OnChangeCostCenter.bind(this)} OnChangeYear={this.props.OnChangeYear.bind(this)} OnChangeExpenseInputView={this.props.OnChangeExpenseInputView.bind(this)} 
            OnChangeitemCategoryId={this.props.OnChangeitemCategoryId.bind(this)}/>
        </td>
      </tr>
      </table>
      );

    }
    
  }

}
