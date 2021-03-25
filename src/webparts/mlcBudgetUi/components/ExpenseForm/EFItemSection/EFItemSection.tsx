
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
import styles from '../../MlcBudgetingApp.module.scss';
import { AadHttpClient} from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Constants } from '../../Constants';
import {EFItemSectionOE} from './EFItemSectionOE';

export interface IEFItemSectionProps {
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
  itemCategoryId:string;
  BudgetCategoryOptions:IComboBoxOptionLoan[];
  CostCenterOptions:IComboBoxOptionLoan[];
  BudgetYearOptions:IComboBoxOptionLoan[];
  OnChangeItemId:Function;
  refresh:number;
}

export interface IEFItemSectionState {
  budgetCategoryText:string;
  budgetCategoryId:string;
  costCenterText:string;
  costCenterId:string;
  budgetYearId:string;
  budgetYearText:string;
  itemCategoryId:string;
  BudgetCategoryOptions:IComboBoxOptionLoan[];
  CostCenterOptions:IComboBoxOptionLoan[];
}

export class IComboBoxOptionLoan implements IComboBoxOption
    {
      public key: string;
      public text : string;
    }


export class EFItemSection extends React.Component<IEFItemSectionProps, IEFItemSectionState> {
  
  constructor(props: IEFItemSectionProps) {
    super(props);

    let BudgetCategoryOption:IComboBoxOptionLoan[] = this.getBudgetCategoryOptions();
    let CostCenterOption:IComboBoxOptionLoan[] = this.getCostCenterOptions();

    this.state = {budgetCategoryText:this.props.budgetCategoryText, budgetCategoryId:this.props.budgetCategoryId,  costCenterText:this.props.costCenterText,
      costCenterId:this.props.costCenterId, BudgetCategoryOptions:BudgetCategoryOption, CostCenterOptions:CostCenterOption, itemCategoryId:this.props.itemCategoryId,
      budgetYearId:this.props.budgetYearId, budgetYearText:this.props.budgetCategoryText
    };
  }

  public render(): JSX.Element {
    //if(this.props.budgetCategoryId != this.state.budgetCategoryId)
    //{
    //  this.setState({budgetCategoryId:this.props.budgetCategoryId});
   // }
    if(this.props.budgetCategoryId == "1")
    {
      return (
        <table style={{width:"100%"}}>
        <tr style={{width:"100%"}}>
        <td colSpan={2} style={{width:"100%"}}>
          <EFItemSectionOE refresh={this.props.refresh} OnChangeItemId={this.props.OnChangeItemId.bind(this)} budgetAppClient={this.props.budgetAppClient} context={this.props.context}  budgetCategoryText={this.props.budgetCategoryText} budgetCategoryId={this.props.budgetCategoryId} costCenterText={this.props.costCenterText}
            costCenterId={this.props.costCenterId} budgetYearId={this.props.costCenterText} budgetYearText={this.props.budgetYearText} OnBudgetCategoryChange={this.props.OnBudgetCategoryChange.bind(this)}
            OnChangeCostCenter={this.props.OnChangeCostCenter.bind(this)} OnChangeYear={this.props.OnChangeYear.bind(this)} OnChangeExpenseInputView={this.props.OnChangeExpenseInputView.bind(this)} 
            OnChangeitemCategoryId={this.props.OnChangeitemCategoryId.bind(this)} itemCategoryId={this.props.itemCategoryId}  
            BudgetCategoryOptions={this.props.BudgetCategoryOptions} CostCenterOptions={this.props.CostCenterOptions}  BudgetYearOptions={this.props.BudgetYearOptions}/>
        </td>
      </tr>
      </table>
      );
    }
    else if(this.props.budgetCategoryId == "2")
    {
      return (
        <table style={{width:"100%"}}>
          <tr>
          <td colSpan={2}>
            Budget 2
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
        Budget 3
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
        Budget 4
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
        Budget 5
        </td>
      </tr>
      </table>
      );
    }
  }

    public OnBudgetCategoryChangeInner(evt,Cmb_Selected)
    {
        this.props.OnBudgetCategoryChange(Cmb_Selected.key);
    }

    public getBudgetCategoryOptions(): IComboBoxOptionLoan[]
  {
    
          let ComOptions:IComboBoxOptionLoan[] = [];
          let comOption = new IComboBoxOptionLoan();
          comOption.key = "1"; 
          comOption.text = "Operating Expense";
          ComOptions = ComOptions.concat(comOption);
          comOption = new IComboBoxOptionLoan();
          comOption.key = "2"; 
          comOption.text = "Building and Maint - Capital";
          ComOptions = ComOptions.concat(comOption);
          comOption = new IComboBoxOptionLoan();
          comOption.key = "3"; 
          comOption.text = "Staff Learning";
          ComOptions = ComOptions.concat(comOption);
          comOption = new IComboBoxOptionLoan();
          comOption.key = "4"; 
          comOption.text = "Technology Capital";
          ComOptions = ComOptions.concat(comOption);
          comOption = new IComboBoxOptionLoan();
          comOption.key = "5"; 
          comOption.text = "Dept Fixed Assets - Capital";
          ComOptions = ComOptions.concat(comOption);

    return ComOptions;
  }


  public getCostCenterOptions(): IComboBoxOptionLoan[]
  {
    
          let ComOptions:IComboBoxOptionLoan[] = [];
          let comOption = new IComboBoxOptionLoan();
          comOption.key = "1"; 
          comOption.text = "Marshmead";
          ComOptions = ComOptions.concat(comOption);
          comOption = new IComboBoxOptionLoan();
          comOption.key = "2"; 
          comOption.text = "Library";
          ComOptions = ComOptions.concat(comOption);
          comOption = new IComboBoxOptionLoan();
          comOption.key = "3"; 
          comOption.text = "Marketing and Communications";
          ComOptions = ComOptions.concat(comOption);
          comOption = new IComboBoxOptionLoan();
          comOption.key = "4"; 
          comOption.text = "MLC Banksia";
          ComOptions = ComOptions.concat(comOption);
          comOption = new IComboBoxOptionLoan();
          comOption.key = "5"; 
          comOption.text = "Kindle";
          ComOptions = ComOptions.concat(comOption);

    return ComOptions;
  }

  public getBudgetYearOptions(): IComboBoxOptionLoan[]
  {
    
      let ComOptions:IComboBoxOptionLoan[] = [];
      let comOption = new IComboBoxOptionLoan();
      comOption.key = "1"; 
      comOption.text = "2021";
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = "2"; 
      comOption.text = "2020";
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = "3"; 
      comOption.text = "2019";
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = "4"; 
      comOption.text = "2018";
      ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();
      comOption.key = "5"; 
      comOption.text = "2017";
      ComOptions = ComOptions.concat(comOption);

      return ComOptions;
  }
  

}
