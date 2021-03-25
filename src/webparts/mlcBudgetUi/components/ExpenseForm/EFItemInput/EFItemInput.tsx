
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
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Constants } from '../../Constants';
import { AadHttpClient , IHttpClientOptions} from '@microsoft/sp-http';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { EFItemInputOE } from './EFItemInputOE';


export interface IEFItemInputProps {
  itemId:string;
  budgetAppClient : AadHttpClient;
  context: WebPartContext;
  costCenterId:string;
  AccountNumberId:string;
  refreshThis:Function;
  YearId:string;
  OnChangeItemId:Function;
  

}

export interface InputItem {
  itemId:string;
  ExpenseCategoryId:number;
  BudgetCategoryId:string;
  costCenterId:string;
  AccountNumberId:string;
  ItemDescription:string;
  priorityId:string;
  APP_Quantity:number;
  Quantity:number;
  JAN_TOT:number;
  FEB_TOT:number;
  MAR_TOT:number;
  APR_TOT:number;
  MAY_TOT:number;
  JUN_TOT:number;
  JUL_TOT:number;
  AUG_TOT:number;
  SEP_TOT:number;
  OCT_TOT:number;
  NOV_TOT:number;
  DEC_TOT:number;
  APP_JAN_TOT:number;
  APP_FEB_TOT:number;
  APP_MAR_TOT:number;
  APP_APR_TOT:number;
  APP_MAY_TOT:number;
  APP_JUN_TOT:number;
  APP_JUL_TOT:number;
  APP_AUG_TOT:number;
  APP_SEP_TOT:number;
  APP_OCT_TOT:number;
  APP_NOV_TOT:number;
  APP_DEC_TOT:number;
  ApprovedId:string;
  Approval_Comments:string;
  //YearId:string;
  user:string;
  Comments:string;
}

export interface IEFItemInputState {
  item:any;
  itemId:string;
  ITEM_DESC:string;
  ExpenseCategoryId:string;
  BudgetCategoryId:string;
  costCenterId:string;
  AccountNumberId:string;
  PRIORITY:string;
  priorityOptions:IComboBoxOptionLoan[];
  approvalOptions:IComboBoxOptionLoan[];
  //inputItem:InputItem
  JAN_TOT:number;
  FEB_TOT:number;
  MAR_TOT:number;
  APR_TOT:number;
  MAY_TOT:number;
  JUN_TOT:number;
  JUL_TOT:number;
  AUG_TOT:number;
  SEP_TOT:number;
  OCT_TOT:number;
  NOV_TOT:number;
  DEC_TOT:number;
  APP_JAN_TOT:number;
  APP_FEB_TOT:number;
  APP_MAR_TOT:number;
  APP_APR_TOT:number;
  APP_MAY_TOT:number;
  APP_JUN_TOT:number;
  APP_JUL_TOT:number;
  APP_AUG_TOT:number;
  APP_SEP_TOT:number;
  APP_OCT_TOT:number;
  APP_NOV_TOT:number;
  APP_DEC_TOT:number;
  hideDialog:boolean;
  isDraggable: boolean;
  hideMsgDialog: boolean;
  dialogBoxMsg: string;
  COMMENTS:string;
  APPROVED:string;
  REASON:string;
  ItemsAdded:number;
  AllowedBudgetYear:string;
  IsBudgetReadOnly:boolean;
  IsAdmin:boolean;
}

export class IComboBoxOptionLoan implements IComboBoxOption
    {
      public key: string;
      public text : string;
    }


export class EFItemInput extends React.Component<IEFItemInputProps, IEFItemInputState> {

  private _dragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
  };

  constructor(props: IEFItemInputProps) {
    super(props);
  }


  public render(): JSX.Element {
    
    return(
      <div>
            <EFItemInputOE  OnChangeItemId={this.props.OnChangeItemId.bind(this)} itemId={this.props.itemId}  budgetAppClient={this.props.budgetAppClient} context={this.props.context} 
              costCenterId={this.state.costCenterId} AccountNumberId={this.props.itemCategoryId} YearId={this.props.budgetYearId} 
              refreshThis={this.props.refreshThis.bind(this)} />
      </div>
    
    );
  }



}
