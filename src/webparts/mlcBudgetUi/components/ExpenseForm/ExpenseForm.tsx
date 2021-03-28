
import * as React from 'react';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { ITheme, getTheme, getFocusStyle } from 'office-ui-fabric-react/lib/Styling';
//import { createListItems, IExampleItem } from '@uifabric/example-data';
import {  PrimaryButton, Stack, IStackTokens } from 'office-ui-fabric-react';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import NumberFormat from 'react-number-format';
import { escape, times } from '@microsoft/sp-lodash-subset';
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

import { TopAlert } from '../Alert/TopAlert';
import { MiddleBody } from '../Body/MiddleBody';
import { RightButtonSection } from '../RightButtonSection/RightButtonSection';
import { ExpenseTableMain } from '../ExpenseTable/ExpenseTableMain';
import { EFHeader } from './EFHeader/EFHeader';
import { EFItemSection } from './EFItemSection/EFItemSection';
import { EFItemInput } from './EFItemInput/EFItemInput';
import styles from '../MlcBudgetingApp.module.scss';
import { AadHttpClient} from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";




export interface IExpenseFormProps {
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
  OnChangeItemId:Function;
  budgetAppClient : AadHttpClient;
  context: WebPartContext;
  itemCategoryId:string;
  itemId:string;
  BudgetCategoryOptions:IComboBoxOptionLoan[];
CostCenterOptions:IComboBoxOptionLoan[];
BudgetYearOptions:IComboBoxOptionLoan[];
}

export interface IExpenseFormState {
  budgetCategoryText:string;
  budgetCategoryId:string;
  costCenterText:string;
  costCenterId:string;
  budgetYearId:string;
  budgetYearText:string;
  itemCategoryId:string;
  refresh:number;
}

export class IComboBoxOptionLoan implements IComboBoxOption
    {
      public key: string;
      public text : string;
    }


export class ExpenseForm extends React.Component<IExpenseFormProps, IExpenseFormState> {
  
  constructor(props: IExpenseFormProps) {
    super(props);
    this.state = {refresh:0, budgetCategoryId:this.props.budgetCategoryId, budgetCategoryText:this.props.budgetCategoryText, costCenterText:this.props.costCenterText, costCenterId:this.props.costCenterId,
                    budgetYearId:this.props.costCenterId,budgetYearText:this.props.budgetYearText, itemCategoryId:this.props.itemCategoryId};
  }

  public render(): JSX.Element {
    return(
          <table style={{width:"100%",verticalAlign:"top"}} >
            <tr style={{width:"100%",verticalAlign:"top"}}>
              <td colSpan={2}>
                <EFHeader YearText={this.props.budgetYearText} CostCenterText={this.props.costCenterText} />
            </td>
          </tr>
          <tr style={{width:"100%",verticalAlign:"top"}}>
            <td style={{width:"40%",verticalAlign:"top"}} align="left">
              <table style={{width:"100%",verticalAlign:"top"}}>
                <tr style={{width:"100%",verticalAlign:"top"}} >
                  <td style={{width:"100%",verticalAlign:"top"}} colSpan={2}>
                    <EFItemSection itemId={this.props.itemId} refresh={this.state.refresh} OnChangeItemId={this.props.OnChangeItemId.bind(this)}   budgetAppClient={this.props.budgetAppClient} context={this.props.context}  budgetCategoryText={this.props.budgetCategoryText} budgetCategoryId={this.props.budgetCategoryId} costCenterText={this.props.costCenterText}
                        costCenterId={this.props.costCenterId} budgetYearId={this.props.budgetYearId} budgetYearText={this.props.budgetYearText} OnBudgetCategoryChange={this.props.OnBudgetCategoryChange.bind(this)}
                        OnChangeCostCenter={this.props.OnChangeCostCenter.bind(this)} OnChangeYear={this.props.OnChangeYear.bind(this)} OnChangeExpenseInputView={this.props.OnChangeExpenseInputView.bind(this)} 
                        OnChangeitemCategoryId={this.props.OnChangeitemCategoryId.bind(this)} itemCategoryId={this.props.itemCategoryId} 
                        BudgetCategoryOptions={this.props.BudgetCategoryOptions} CostCenterOptions={this.props.CostCenterOptions}  BudgetYearOptions={this.props.BudgetYearOptions}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{width:"50%", paddingLeft:5}} align="left">
                    <DefaultButton text="Expense Table" onClick={this.OnExpenseTableclick.bind(this)} />
                  </td>
                  <td style={{width:"50%", paddingRight:6}}  align="right">
                    <DefaultButton text="New Item" onClick={this.Refreshthis.bind(this)} />
                  </td>
                </tr>
              </table>
            </td>
            <td style={{width:"40%",verticalAlign:"top"}} align="left">
            <EFItemInput budgetCategoryId={this.props.budgetCategoryId} OnChangeItemId={this.props.OnChangeItemId.bind(this)} itemId={this.props.itemId}  budgetAppClient={this.props.budgetAppClient} context={this.props.context} 
              costCenterId={this.state.costCenterId} AccountNumberId={this.props.itemCategoryId} YearId={this.props.budgetYearId} 
              refreshThis={this.Refreshthis.bind(this)} budgetYearId={this.props.budgetYearId} itemCategoryId={this.props.itemCategoryId}
              /> 
            </td>
          </tr>
        </table>
      );

    }

    public OnExpenseTableclick()
    {
      this.props.OnChangeExpenseInputView(false,this.props.itemCategoryId,"0");
    }

    public Refreshthis(ItemsAdded)
    {
      this.props.OnChangeItemId('0');
      this.setState({refresh:ItemsAdded});
    }

    public OnNewItemClick()
    {
      this.props.OnChangeExpenseInputView(false);
    }
  

}
