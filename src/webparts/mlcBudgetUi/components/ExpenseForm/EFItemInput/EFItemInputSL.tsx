
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
import { PopupWindowPosition } from '@microsoft/sp-property-pane';
import Tooltip from '@material-ui/core/Tooltip';


export interface IEFItemInputSLProps {
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

export interface IEFItemInputSLState {
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
  SLItemCategoryOption:IComboBoxOptionLoan[];
  SelectedSL:string;  
  otherTextBoxValue:string;
  otherTextBoxDisable:boolean;
  AttendanceOption:IComboBoxOptionLoan[];
  SelectedAttendance:string;  
}

export class IComboBoxOptionLoan implements IComboBoxOption
    {
      public key: string;
      public text : string;
    }


export class EFItemInputSL extends React.Component<IEFItemInputSLProps, IEFItemInputSLState> {

  private _topElement: HTMLElement;

  private _dragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
  };

  constructor(props: IEFItemInputSLProps) {
    super(props);
    let priorityOptions:IComboBoxOptionLoan[] = this.getPriorityOptions();
    let approvalOptions:IComboBoxOptionLoan[] = this.getApprovalOptions();
    let SLitems:IComboBoxOptionLoan[] = this.getSLItemCategoryOptions();
    let AttendOption:IComboBoxOptionLoan[] = this.getAttendanceOptions();
    this.state = {AttendanceOption:AttendOption,SelectedAttendance:"1",  otherTextBoxValue:"",otherTextBoxDisable:true,SelectedSL:"",SLItemCategoryOption:SLitems,IsAdmin:false, AllowedBudgetYear:this.props.YearId,IsBudgetReadOnly:false, ItemsAdded:1, item:null,itemId:this.props.itemId, BudgetCategoryId:"1",PRIORITY:"1",priorityOptions:priorityOptions,approvalOptions:approvalOptions,
    JAN_TOT:0,FEB_TOT:0,MAR_TOT:0,APR_TOT:0,MAY_TOT:0,JUN_TOT:0,JUL_TOT:0,AUG_TOT:0,SEP_TOT:0,OCT_TOT:0,NOV_TOT:0,DEC_TOT:0,
    APP_JAN_TOT:0,APP_FEB_TOT:0,APP_MAR_TOT:0,APP_APR_TOT:0,APP_MAY_TOT:0,APP_JUN_TOT:0,APP_JUL_TOT:0,APP_AUG_TOT:0,APP_SEP_TOT:0,APP_OCT_TOT:0,APP_NOV_TOT:0,APP_DEC_TOT:0,
    hideDialog:true,hideMsgDialog:true, isDraggable:true, dialogBoxMsg:"Something went Wrong, Please try again",  COMMENTS:"", APPROVED:"0", REASON:"",
    ExpenseCategoryId:"1", ITEM_DESC:"",  costCenterId:this.props.costCenterId,  AccountNumberId:this.props.AccountNumberId
  };
    //this.getItem('0');
  }

  public componentDidMount()
  {
    this.getItem(this.props.itemId);
    this.IsAdmin();
    this.IsBudgetReadOnly();
    this.IsbudgetYear();
    window.scrollTo(0, 0);
  }

  public render(): JSX.Element {
    if(this.props.itemId != this.state.itemId)
    {
      this.getItem(this.props.itemId);

    }
    if(this.state.item == null)
    {
      return (<table>
        <tr>
          <td>
            Loading...
          </td>
        </tr>
      </table>);
    }

    let displayDelete = "";
    if(this.state.itemId == "0" )
    {
      displayDelete = "none";
    }


    let requestFieldsDisabled = false;
    let ApprovedFieldDisabled = true;
    if(this.state.AllowedBudgetYear != this.props.YearId || this.state.IsBudgetReadOnly == true)
    {
      requestFieldsDisabled = true;
      ApprovedFieldDisabled = true;
    }
    if(this.state.IsAdmin == true)
    {
      requestFieldsDisabled = false;
      ApprovedFieldDisabled = false;
      if(this.state.AllowedBudgetYear != this.props.YearId)
      {
        requestFieldsDisabled = true;
        ApprovedFieldDisabled = true;
      }
    }

    //*********************
    requestFieldsDisabled = false;
    ApprovedFieldDisabled = false;
    
    /******/


    let priority = this.state.PRIORITY;
    let approved = this.state.APPROVED;
    let strPriority = "1";
    let strApproved = "0";
    let buttonText = "Save Item";
    let Q1ReqColor = "black";
    let Q2ReqColor = "black";
    let Q3ReqColor = "black";
    let Q4ReqColor = "black";
    let TReqColor = "black";
    let Q1AppColor = "black";
    let Q2AppColor = "black";
    let Q3AppColor = "black";
    let Q4AppColor = "black";
    let TAppColor = "black";
    let Q1DiffColor = "black";
    let Q2DiffColor = "black";
    let Q3DiffColor = "black";
    let Q4DiffColor = "black";
    let Q1DiffMultiplier = 1;
    let Q2DiffMultiplier = 1;
    let Q3DiffMultiplier = 1;
    let Q4DiffMultiplier = 1;
    let TDiffMultiplier = 1;
    let TDiffColor = "black";
    
    if (this.state.JAN_TOT +  this.state.FEB_TOT + this.state.MAR_TOT <0 )
    {
      Q1ReqColor = "red";
    }
    if (this.state.APR_TOT +  this.state.MAY_TOT + this.state.JUN_TOT <0 )
    {
      Q2ReqColor = "red";
    }
    if (this.state.JUL_TOT +  this.state.AUG_TOT + this.state.SEP_TOT <0  )
    {
      Q3ReqColor = "red";
    }
    if (this.state.OCT_TOT +  this.state.NOV_TOT + this.state.DEC_TOT <0 )
    {
      Q4ReqColor = "red";
    }
    if (this.state.APP_JAN_TOT +  this.state.APP_FEB_TOT + this.state.APP_MAR_TOT <0  )
    {

      Q1AppColor = "red";
      //Q1DiffMultiplier = -1;

    }
    if (this.state.APP_APR_TOT +  this.state.APP_MAY_TOT + this.state.APP_JUN_TOT <0
      )
    {
      Q2AppColor = "red";
      //Q2DiffMultiplier = -1;
    }
    if (this.state.APP_JUL_TOT +  this.state.APP_AUG_TOT + this.state.APP_SEP_TOT <0
      )
    {
      Q3AppColor = "red";
      //Q3DiffMultiplier = -1;
    }
    if (this.state.APP_OCT_TOT +  this.state.APP_NOV_TOT + this.state.APP_DEC_TOT <0
      )
    {
      Q4AppColor = "red";
      //Q4DiffMultiplier = -1;
    }

    if ((this.state.JAN_TOT +  this.state.FEB_TOT + this.state.MAR_TOT) -((this.state.APP_JAN_TOT +  this.state.APP_FEB_TOT + this.state.APP_MAR_TOT) * Q1DiffMultiplier) <0)     
    {
      Q1DiffColor = "red";
    }
    if ((this.state.APR_TOT +  this.state.MAY_TOT + this.state.JUN_TOT) -((this.state.APP_APR_TOT +  this.state.APP_MAY_TOT + this.state.APP_JUN_TOT) * Q2DiffMultiplier) <0)     
    {
      Q2DiffColor = "red";
    }
    if ((this.state.JUL_TOT +  this.state.AUG_TOT + this.state.SEP_TOT) -((this.state.APP_JUL_TOT +  this.state.APP_AUG_TOT + this.state.APP_SEP_TOT) * Q3DiffMultiplier) <0)     
    {
      Q3DiffColor = "red";
    }
    if ((this.state.OCT_TOT +  this.state.NOV_TOT + this.state.DEC_TOT) -((this.state.APP_OCT_TOT +  this.state.APP_NOV_TOT + this.state.APP_DEC_TOT) * Q4DiffMultiplier) <0)     
    {
      Q4DiffColor = "red";
    }

    let totaldiffmultuplier = 1;
    let totalDiffColor = "white";

    if((this.state.JAN_TOT +  this.state.FEB_TOT + this.state.MAR_TOT + +this.state.APR_TOT +  this.state.MAY_TOT + this.state.JUN_TOT+this.state.JUL_TOT +  this.state.AUG_TOT + this.state.SEP_TOT+this.state.OCT_TOT +  this.state.NOV_TOT + this.state.DEC_TOT) <0)
    {
      TReqColor = "red";
    }

    if((this.state.APP_JAN_TOT +  this.state.APP_FEB_TOT + this.state.APP_MAR_TOT + +this.state.APP_APR_TOT +  this.state.APP_MAY_TOT + this.state.APP_JUN_TOT+this.state.APP_JUL_TOT +  this.state.APP_AUG_TOT + this.state.APP_SEP_TOT+this.state.APP_OCT_TOT +  this.state.APP_NOV_TOT + this.state.APP_DEC_TOT) <0)
    {
      TAppColor = "red";
      //totaldiffmultuplier = -1;
    }

    if ((this.state.JAN_TOT +  this.state.FEB_TOT + this.state.MAR_TOT + +this.state.APR_TOT +  this.state.MAY_TOT + this.state.JUN_TOT+this.state.JUL_TOT +  this.state.AUG_TOT + this.state.SEP_TOT+this.state.OCT_TOT +  this.state.NOV_TOT + this.state.DEC_TOT) -
      ((this.state.APP_JAN_TOT +  this.state.APP_FEB_TOT + this.state.APP_MAR_TOT + +this.state.APP_APR_TOT +  this.state.APP_MAY_TOT + this.state.APP_JUN_TOT+this.state.APP_JUL_TOT +  this.state.APP_AUG_TOT + this.state.APP_SEP_TOT+this.state.APP_OCT_TOT +  this.state.APP_NOV_TOT + this.state.APP_DEC_TOT)
      * Q4DiffMultiplier) <0)     
    {
      totalDiffColor = "red";
    }

    let addORupdateText = "add";

    if (this.state.itemId!= "0")
    {
      buttonText = "Update Item";
      addORupdateText = "update";
    }
    if (this.state.PRIORITY != null)
    {
      strPriority = this.state.PRIORITY.toString();
    }
    if (this.state.APPROVED != null)
    {
      strApproved = this.state.APPROVED.toString();
    }

    let str_JAN_TOT='' ; 
    if(this.state.JAN_TOT == null) 
      {str_JAN_TOT= '';} 
    else if(this.state.JAN_TOT == 0 && this.state.itemId == '0') 
      { str_JAN_TOT= ''; }     
    else 
      { str_JAN_TOT=  this.state.JAN_TOT.toString();}

    let str_FEB_TOT='' ; if(this.state.FEB_TOT == null) {str_FEB_TOT= '';} else if(this.state.FEB_TOT == 0 && this.state.itemId == '0') { str_FEB_TOT= ''; }     else { str_FEB_TOT=  this.state.FEB_TOT.toString();}
    let str_MAR_TOT='' ; if(this.state.MAR_TOT == null) {str_MAR_TOT= '';} else if(this.state.MAR_TOT == 0 && this.state.itemId == '0') { str_MAR_TOT= ''; }     else { str_MAR_TOT=  this.state.MAR_TOT.toString();}
    let str_APR_TOT='' ; if(this.state.APR_TOT == null) {str_APR_TOT= '';} else if(this.state.APR_TOT == 0 && this.state.itemId == '0') { str_APR_TOT= ''; }     else { str_APR_TOT=  this.state.APR_TOT.toString();}
    let str_MAY_TOT='' ; if(this.state.MAY_TOT == null) {str_MAY_TOT= '';} else if(this.state.MAY_TOT == 0 && this.state.itemId == '0') { str_MAY_TOT= ''; }     else { str_MAY_TOT=  this.state.MAY_TOT.toString();}
    let str_JUN_TOT='' ; if(this.state.JUN_TOT == null) {str_JUN_TOT= '';} else if(this.state.JUN_TOT == 0 && this.state.itemId == '0') { str_JUN_TOT= ''; }     else { str_JUN_TOT=  this.state.JUN_TOT.toString();}
    let str_JUL_TOT='' ; if(this.state.JUL_TOT == null) {str_JUL_TOT= '';} else if(this.state.JUL_TOT == 0 && this.state.itemId == '0') { str_JUL_TOT= ''; }     else { str_JUL_TOT=  this.state.JUL_TOT.toString();}
    let str_AUG_TOT='' ; if(this.state.AUG_TOT == null) {str_AUG_TOT= '';} else if(this.state.AUG_TOT == 0 && this.state.itemId == '0') { str_AUG_TOT= ''; }     else { str_AUG_TOT=  this.state.AUG_TOT.toString();}
    let str_SEP_TOT='' ; if(this.state.SEP_TOT == null) {str_SEP_TOT= '';} else if(this.state.SEP_TOT == 0 && this.state.itemId == '0') { str_SEP_TOT= ''; }     else { str_SEP_TOT=  this.state.SEP_TOT.toString();}
    let str_OCT_TOT='' ; if(this.state.OCT_TOT == null) {str_OCT_TOT= '';} else if(this.state.OCT_TOT == 0 && this.state.itemId == '0') { str_OCT_TOT= ''; }     else { str_OCT_TOT=  this.state.OCT_TOT.toString();}
    let str_NOV_TOT='' ; if(this.state.NOV_TOT == null) {str_NOV_TOT= '';} else if(this.state.NOV_TOT == 0 && this.state.itemId == '0') { str_NOV_TOT= ''; }     else { str_NOV_TOT=  this.state.NOV_TOT.toString();}
    let str_DEC_TOT='' ; if(this.state.DEC_TOT == null) {str_DEC_TOT= '';} else if(this.state.DEC_TOT == 0 && this.state.itemId == '0') { str_DEC_TOT= ''; }     else { str_DEC_TOT=  this.state.DEC_TOT.toString();}

    let str_APP_JAN_TOT='' ; if(this.state.APP_JAN_TOT == null) {str_APP_JAN_TOT= '';} else if(this.state.APP_JAN_TOT == 0 && this.state.itemId == '0') { str_APP_JAN_TOT= ''; }     else { str_APP_JAN_TOT=  this.state.APP_JAN_TOT.toString();}
    let str_APP_FEB_TOT='' ; if(this.state.APP_FEB_TOT == null) {str_APP_FEB_TOT= '';} else if(this.state.APP_FEB_TOT == 0 && this.state.itemId == '0') { str_APP_FEB_TOT= ''; }     else { str_APP_FEB_TOT=  this.state.APP_FEB_TOT.toString();}
    let str_APP_MAR_TOT='' ; if(this.state.APP_MAR_TOT == null) {str_APP_MAR_TOT= '';} else if(this.state.APP_MAR_TOT == 0 && this.state.itemId == '0') { str_APP_MAR_TOT= ''; }     else { str_APP_MAR_TOT=  this.state.APP_MAR_TOT.toString();}
    let str_APP_APR_TOT='' ; if(this.state.APP_APR_TOT == null) {str_APP_APR_TOT= '';} else if(this.state.APP_APR_TOT == 0 && this.state.itemId == '0') { str_APP_APR_TOT= ''; }     else { str_APP_APR_TOT=  this.state.APP_APR_TOT.toString();}
    let str_APP_MAY_TOT='' ; if(this.state.APP_MAY_TOT == null) {str_APP_MAY_TOT= '';} else if(this.state.APP_MAY_TOT == 0 && this.state.itemId == '0') { str_APP_MAY_TOT= ''; }     else { str_APP_MAY_TOT=  this.state.APP_MAY_TOT.toString();}
    let str_APP_JUN_TOT='' ; if(this.state.APP_JUN_TOT == null) {str_APP_JUN_TOT= '';} else if(this.state.APP_JUN_TOT == 0 && this.state.itemId == '0') { str_APP_JUN_TOT= ''; }     else { str_APP_JUN_TOT=  this.state.APP_JUN_TOT.toString();}
    let str_APP_JUL_TOT='' ; if(this.state.APP_JUL_TOT == null) {str_APP_JUL_TOT= '';} else if(this.state.APP_JUL_TOT == 0 && this.state.itemId == '0') { str_APP_JUL_TOT= ''; }     else { str_APP_JUL_TOT=  this.state.APP_JUL_TOT.toString();}
    let str_APP_AUG_TOT='' ; if(this.state.APP_AUG_TOT == null) {str_APP_AUG_TOT= '';} else if(this.state.APP_AUG_TOT == 0 && this.state.itemId == '0') { str_APP_AUG_TOT= ''; }     else { str_APP_AUG_TOT=  this.state.APP_AUG_TOT.toString();}
    let str_APP_SEP_TOT='' ; if(this.state.APP_SEP_TOT == null) {str_APP_SEP_TOT= '';} else if(this.state.APP_SEP_TOT == 0 && this.state.itemId == '0') { str_APP_SEP_TOT= ''; }     else { str_APP_SEP_TOT=  this.state.APP_SEP_TOT.toString();}
    let str_APP_OCT_TOT='' ; if(this.state.APP_OCT_TOT == null) {str_APP_OCT_TOT= '';} else if(this.state.APP_OCT_TOT == 0 && this.state.itemId == '0') { str_APP_OCT_TOT= ''; }     else { str_APP_OCT_TOT=  this.state.APP_OCT_TOT.toString();}
    let str_APP_NOV_TOT='' ; if(this.state.APP_NOV_TOT == null) {str_APP_NOV_TOT= '';} else if(this.state.APP_NOV_TOT == 0 && this.state.itemId == '0') { str_APP_NOV_TOT= ''; }     else { str_APP_NOV_TOT=  this.state.APP_NOV_TOT.toString();}
    let str_APP_DEC_TOT='' ; if(this.state.APP_DEC_TOT == null) {str_APP_DEC_TOT= '';} else if(this.state.APP_DEC_TOT == 0 && this.state.itemId == '0') { str_APP_DEC_TOT= ''; }     else { str_APP_DEC_TOT=  this.state.APP_DEC_TOT.toString();}


    return(
      <div>
                <span className="ms-font-xl ms-fontColor-white" 
                 ref={(topElement) => this._topElement = topElement!}>&nbsp;</span><br />
        <table style={{width:"100%"}}>
          <tr>
            <td style={{backgroundColor:"#89c4f4",color:"white",padding:"10px" }} align="center" >
              To {addORupdateText} an item, complete the form below, then click the {buttonText} button
            </td>
          </tr>
           <tr style={{width:"100%"}}>
            <td style={{backgroundColor:"light blue", width:"100%"}}>
              <table style={{width:"100%"}}>
                <tr style={{width:"100%"}}>
                  <td style={{width:"100%"}} colSpan={2}>
                    <b>Item:</b>
                  </td>
                </tr>
                <tr style={{width:"100%"}}>
                  <td style={{width:"50%"}}>
                    <ComboBox
                    label=""
                    key={'SLItems'}
                    style={{width:"100%"}}
                    autoComplete={true ? 'on' : 'off'}
                    options={this.state.SLItemCategoryOption}
                    selectedKey= {this.state.SelectedSL}
                    disabled={requestFieldsDisabled}
                    onChange ={this.comboSLItemChange.bind(this)}
                    />
                  </td>
                  <td style={{width:"50%"}}>
                    <TextField value={this.state.ITEM_DESC} onChange={this.ChangeItemDesc.bind(this)} disabled={(requestFieldsDisabled || this.state.otherTextBoxDisable)} />
                  </td>
                </tr>
              </table>
                        
            </td>
          </tr>
          <tr style={{width:"100%"}}>
            <td style={{width:"100%"}}>
              <table style={{width:"100%"}}>
                <tr style={{width:"100%"}}>
                  <td style={{width:"50%"}}>
                    <b>Priority:</b>
                  </td>
                  <td style={{width:"50%"}}>
                    <b>Attendance:</b>
                  </td>
                </tr>
                <tr style={{width:"100%"}}>
                  <td>
                    <ComboBox
                    label=""
                    key={'Priority'}
                    style={{width:"35%"}}
                    autoComplete={true ? 'on' : 'off'}
                    options={this.state.priorityOptions}
                    selectedKey= {strPriority}
                    disabled={requestFieldsDisabled}
                    onChange ={this.comboPRIORITY.bind(this)}
                    />
                  </td>
                  <td  >
                  <ComboBox
                    label=""
                    key={'Attendance'}
                    style={{width:"35%"}}
                    autoComplete={true ? 'on' : 'off'}
                    options={this.state.AttendanceOption}
                    selectedKey= {this.state.SelectedAttendance}
                    disabled={requestFieldsDisabled}
                    onChange ={this.comboAttendance.bind(this)}
                    />
                  </td>
                </tr>
              </table>
                   
                  </td>
          </tr>

         <tr>
            <td>
              <table  >
                <tr>
                  <td style={{width:"17%"}} >
                    &nbsp;
                  </td>
                  <td>&nbsp;</td>
                  <td align="right" style={{width:"17%"}}>
                    <b>Requested</b>
                  </td>
                  <td align="right" style={{width:"17%"}}>
                    <b>Quarterly</b>
                  </td>
                  <td>&nbsp;</td>
                  <td align="right" style={{width:"17%", cursor:"pointer"}}  onClick={this.copyApproved.bind(this)}>
                      <Tooltip title={<h3>Click to Fill-down Amounts</h3>} placement="top" arrow>
                        <b>Approved</b>    
                        </Tooltip>
                  </td>
                  <td align="right" style={{width:"17%"}}>
                    <b>Quarterly</b>
                  </td>
                  <td align="right" style={{width:"15%"}}>
                    <b>Variance</b>
                  </td>
                </tr>
                <tr >
                  <td >
                    <b>Jan Total:</b>
                  </td>
                  <td><b>$</b></td>
                  <td align="right"  >
                   <TextField disabled={requestFieldsDisabled} style={{textAlign:"right"}} label="" value={str_JAN_TOT} onChange={this.handleChangeJAN_TOT.bind(this)}></TextField>
                  </td>
                  <td  >
                    &nbsp;
                  </td>
                  <td>&nbsp;</td>
                  <td align="right"  > 
                  <TextField label="" disabled={ApprovedFieldDisabled}  id="APP_JAN_TOT" style={{textAlign:"right"}} value={str_APP_JAN_TOT} onChange={this.handleChangeAPP_JAN_TOT.bind(this)}></TextField>
                  </td>
                  <td  >
                  &nbsp;
                  </td>
                  <td  >
                  &nbsp;
                  </td>
                  </tr>
                  <tr >
                      <td>
                        <b>Feb Total:</b>
                      </td>
                      <td><b>$</b></td>
                      <td align="right">
                      <TextField label="" disabled={requestFieldsDisabled} style={{textAlign:"right"}} value={str_FEB_TOT} onChange={this.handleChangeFEB_TOT.bind(this)} ></TextField>
                      </td>
                      
                      <td>
                        &nbsp;
                      </td>
                      <td>&nbsp;</td>
                      <td align="right">
                      <TextField style={{textAlign:"right"}} disabled={ApprovedFieldDisabled} label="" id="APP_FEB_TOT" value={str_APP_FEB_TOT.toString()} onChange={this.handleChangeAPP_FEB_TOT.bind(this)} ></TextField>
                      </td>
                      <td>
                      &nbsp;
                      </td>
                      <td>
                      &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Mar Total:</b>
                      </td>
                      <td><b>$</b></td>
                      <td align="right">
                       <TextField label="" disabled={requestFieldsDisabled}  style={{textAlign:"right"}} value={str_MAR_TOT} onChange={this.handleChangeMAR_TOT.bind(this)} ></TextField>
                      </td>
                      <td  align="right" > <b>
                        <NumberFormat style={{color:Q1ReqColor}} value={Number(this.state.MAR_TOT + this.state.FEB_TOT + this.state.JAN_TOT).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
                        </b>
                      </td>
                      <td>&nbsp;</td>
                      <td align="right">
                       <TextField disabled={ApprovedFieldDisabled}  style={{textAlign:"right"}} label="" id="APP_MAR_TOT" value={str_APP_MAR_TOT} onChange={this.handleChangeAPP_MAR_TOT.bind(this)}></TextField>
                      </td>
                      <td  align="right"> <b>
                        <NumberFormat style={{color:Q1AppColor}} value={Number(this.state.APP_MAR_TOT + this.state.APP_FEB_TOT + this.state.APP_JAN_TOT).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
                        </b>
                      </td>
                      <td  align="right"> <b>
                        <NumberFormat style={{color:Q1DiffColor}} value={Number((this.state.MAR_TOT + this.state.FEB_TOT + this.state.JAN_TOT) - ((this.state.APP_MAR_TOT + this.state.APP_FEB_TOT + this.state.APP_JAN_TOT)*Q1DiffMultiplier)).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
                        </b>
                      </td>
                    </tr>
                    <tr style={{borderBottomWidth:"1px", borderBottomColor:"black", borderBottomStyle:"solid" }}>
                      <td colSpan={8} style={{borderBottomWidth:"1px", borderBottomColor:"black", borderBottomStyle:"solid" }}></td>
                    </tr>
                   <tr>
                      <td className={styles.tdtop}>
                        <b>Apr Total:</b>
                      </td>
                      <td><b>$</b></td>
                      <td className={styles.tdtop}>
                      <TextField disabled={requestFieldsDisabled}  style={{textAlign:"right"}} label="" value={str_APR_TOT} onChange={this.handleChangeAPR_TOT.bind(this)} ></TextField>
                      </td>
                      <td className={styles.tdtop}>
                        &nbsp;
                      </td>
                      <td>&nbsp;</td>
                      <td className={styles.tdtop}>
                      <TextField disabled={ApprovedFieldDisabled}  style={{textAlign:"right"}} label="" id="APP_APR_TOT" value={str_APP_APR_TOT} onChange={this.handleChangeAPP_APR_TOT.bind(this)} ></TextField>
                      </td>
                      <td className={styles.tdtop}>
                      &nbsp;
                      </td>
                      <td className={styles.tdtop}>
                      &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>May Total:</b>
                      </td>
                      <td><b>$</b></td>
                      <td>
                      <TextField disabled={requestFieldsDisabled}  style={{textAlign:"right"}} label="" value={str_MAY_TOT} onChange={this.handleChangeMAY_TOT.bind(this)}></TextField>
                      </td>
                      <td>
                        &nbsp;
                      </td>
                      <td>&nbsp;</td>
                      <td>
                      <TextField disabled={ApprovedFieldDisabled}  label="" id="APP_MAY_TOT" style={{textAlign:"right"}} value={str_APP_MAY_TOT} onChange={this.handleChangeAPP_MAY_TOT.bind(this)} ></TextField>
                      </td>
                      <td>
                      &nbsp;
                      </td>
                      <td>
                      &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Jun Total:</b>
                      </td>
                      <td><b>$</b></td>
                      <td>
                      <TextField disabled={requestFieldsDisabled}  label="" value={str_JUN_TOT} style={{textAlign:"right"}} onChange={this.handleChangeJUN_TOT.bind(this)}></TextField>
                      </td>
                      <td  align="right"> <b>
                      <NumberFormat style={{color:Q2ReqColor}} value={Number(this.state.APR_TOT + this.state.MAY_TOT + this.state.JUN_TOT).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
                      </b>
                      </td>
                      <td>&nbsp;</td>
                      <td>
                      <TextField disabled={ApprovedFieldDisabled}  label="" id="APP_JUN_TOT" value={str_APP_JUN_TOT} style={{textAlign:"right"}} onChange={this.handleChangeAPP_JUN_TOT.bind(this)} ></TextField>
                      </td>
                      <td  align="right"><b>
                        <NumberFormat style={{color:Q2AppColor}} value={Number(this.state.APP_APR_TOT + this.state.APP_MAY_TOT + this.state.APP_JUN_TOT).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
                        </b>
                      </td>
                      <td  align="right"> <b>
                        <NumberFormat style={{color:Q2DiffColor}} value={Number((this.state.APR_TOT + this.state.MAY_TOT + this.state.JUN_TOT ) - ((this.state.APP_APR_TOT + this.state.APP_MAY_TOT + this.state.APP_JUN_TOT)*Q2DiffMultiplier)).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
                        </b>
                      </td>
                    </tr>
                    <tr style={{borderBottomWidth:"1px", borderBottomColor:"black", borderBottomStyle:"solid" }}>
                      <td colSpan={8} style={{borderBottomWidth:"1px", borderBottomColor:"black", borderBottomStyle:"solid" }}></td>
                    </tr>
                    <tr>
                      <td className={styles.tdtop}>
                        <b>Jul Total:</b>
                      </td>
                      <td><b>$</b></td>
                      <td className={styles.tdtop}>
                      <TextField disabled={requestFieldsDisabled}  label="" value={str_JUL_TOT} style={{textAlign:"right"}} onChange={this.handleChangeJUL_TOT.bind(this)}></TextField>
                      </td>
                      <td className={styles.tdtop}>
                        &nbsp;
                      </td>
                      <td>&nbsp;</td>
                      <td className={styles.tdtop}>
                      <TextField disabled={ApprovedFieldDisabled}  label="" id="APP_JUL_TOT" value={str_APP_JUL_TOT} style={{textAlign:"right"}} onChange={this.handleChangeAPP_JUL_TOT.bind(this)}></TextField>
                      </td>
                      <td className={styles.tdtop}>
                      &nbsp;
                      </td>
                      <td className={styles.tdtop}>
                      &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Aug Total:</b>
                      </td>
                      <td><b>$</b></td>
                      <td>
                      <TextField disabled={requestFieldsDisabled}  label="" value={str_AUG_TOT} style={{textAlign:"right"}} onChange={this.handleChangeAUG_TOT.bind(this)}></TextField>
                      </td>
                      <td>
                        &nbsp;
                      </td>
                      <td>&nbsp;</td>
                      <td>
                      <TextField disabled={ApprovedFieldDisabled}  label="" id="APP_AUG_TOT" value={str_APP_AUG_TOT} style={{textAlign:"right"}} onChange={this.handleChangeAPP_AUG_TOT.bind(this)}></TextField>
                      </td>
                      <td>
                      &nbsp;
                      </td>
                      <td>
                      &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Sep Total:</b>
                      </td>
                      <td><b>$</b></td>
                      <td>
                      <TextField disabled={requestFieldsDisabled}  label="" value={str_SEP_TOT} style={{textAlign:"right"}} onChange={this.handleChangeSEP_TOT.bind(this)}></TextField>
                      </td>
                      <td  align="right"><b>
                        <NumberFormat style={{color:Q3ReqColor}} value={Number(this.state.JUL_TOT + this.state.AUG_TOT + this.state.SEP_TOT).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
                        </b>
                      </td>
                      <td>&nbsp;</td>
                      <td>
                       <TextField disabled={ApprovedFieldDisabled}  label="" id="APP_SEP_TOT" value={str_APP_SEP_TOT}  style={{textAlign:"right"}} onChange={this.handleChangeAPP_SEP_TOT.bind(this)}></TextField>
                      </td>
                      <td  align="right"><b>
                        <NumberFormat style={{color:Q3AppColor}} value={Number(this.state.APP_JUL_TOT + this.state.APP_AUG_TOT + this.state.APP_SEP_TOT).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 

                        </b>
                      </td>
                      <td  align="right"><b>
                        <NumberFormat style={{color:Q3DiffColor}} value={Number((this.state.JUL_TOT + this.state.AUG_TOT + this.state.SEP_TOT) - ((this.state.APP_JUL_TOT + this.state.APP_AUG_TOT + this.state.APP_SEP_TOT) *Q3DiffMultiplier)).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
                        </b>
                      </td>
                    </tr>
                    <tr style={{borderBottomWidth:"1px", borderBottomColor:"black", borderBottomStyle:"solid" }}>
                      <td colSpan={8} style={{borderBottomWidth:"1px", borderBottomColor:"black", borderBottomStyle:"solid" }}></td>
                    </tr>
                    <tr>
                      <td className={styles.tdtop}>
                        <b>Oct Total:</b>
                      </td>
                      <td><b>$</b></td>
                      <td className={styles.tdtop}>
                       <TextField disabled={requestFieldsDisabled}  label=""  value={str_OCT_TOT} style={{textAlign:"right"}} onChange={this.handleChangeOCT_TOT.bind(this)}></TextField>
                      </td>
                      <td className={styles.tdtop}>
                        &nbsp;
                      </td>
                      <td>&nbsp;</td>
                      <td className={styles.tdtop}>
                       <TextField disabled={ApprovedFieldDisabled}  label="" id="APP_OCT_TOT" value={str_APP_OCT_TOT} style={{textAlign:"right"}} onChange={this.handleChangeAPP_OCT_TOT.bind(this)}></TextField>
                      </td>
                      <td className={styles.tdtop}>
                      &nbsp;
                      </td>
                      <td className={styles.tdtop}>
                      &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Nov Total:</b>
                      </td>
                      <td><b>$</b></td>
                      <td>
                       <TextField disabled={requestFieldsDisabled}  label=""  value={str_NOV_TOT} style={{textAlign:"right"}} onChange={this.handleChangeNOV_TOT.bind(this)}></TextField>
                      </td>
                      <td>
                        &nbsp;
                      </td>
                      <td>&nbsp;</td>
                      <td>
                       <TextField disabled={ApprovedFieldDisabled}  label="" id="APP_NOV_TOT" value={str_APP_NOV_TOT} style={{textAlign:"right"}} onChange={this.handleChangeAPP_NOV_TOT.bind(this)}></TextField>
                      </td>
                      <td>
                      &nbsp;
                      </td>
                      <td>
                      &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Dec Total:</b>
                      </td>
                      <td><b>$</b></td>
                      <td>
                       <TextField disabled={requestFieldsDisabled}  label=""  value={str_DEC_TOT} style={{textAlign:"right"}} onChange={this.handleChangeDEC_TOT.bind(this)}></TextField>
                      </td>
                      <td  align="right"><b>
                        <NumberFormat style={{color:Q4ReqColor}} value={Number(this.state.OCT_TOT + this.state.NOV_TOT + this.state.DEC_TOT).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
                        </b>
                      </td>
                      <td>&nbsp;</td>
                      <td>
                       <TextField disabled={ApprovedFieldDisabled}  label="" id="APP_DEC_TOT" value={str_APP_DEC_TOT} style={{textAlign:"right"}} onChange={this.handleChangeAPP_DEC_TOT.bind(this)}></TextField>
                      </td>
                      <td align="right"> <b>
                        <NumberFormat style={{color:Q4AppColor}} value={Number(this.state.APP_OCT_TOT + this.state.APP_NOV_TOT + this.state.APP_DEC_TOT).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
                        </b>
                      </td>
                      <td  align="right"><b>
                        <NumberFormat style={{color:Q4DiffColor}} value={Number((this.state.OCT_TOT + this.state.NOV_TOT + this.state.DEC_TOT) - ((this.state.APP_OCT_TOT + this.state.APP_NOV_TOT + this.state.APP_DEC_TOT)*Q4DiffMultiplier)).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
                      </b>
                      </td>
                    </tr>
                    <tr style={{borderBottomWidth:"1px", borderBottomColor:"black", borderBottomStyle:"solid" }}>
                      <td colSpan={8} style={{borderBottomWidth:"1px", borderBottomColor:"black", borderBottomStyle:"solid" }}></td>
                    </tr>
                    <tr>
                      <td>
                        <b>
                        Totals:
                        </b>
                      </td>
                      <td>
                        &nbsp;
                      </td>
                      <td>
                        &nbsp;
                      </td>
                      <td align="right">
                      <b>
                        <NumberFormat style={{color:TReqColor}} value={Number(this.state.JAN_TOT + this.state.FEB_TOT + this.state.MAR_TOT +this.state.APR_TOT + this.state.MAY_TOT + this.state.JUN_TOT +this.state.JUL_TOT + this.state.AUG_TOT + this.state.SEP_TOT +this.state.OCT_TOT + this.state.NOV_TOT + this.state.DEC_TOT).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 

                        </b>
                      </td>
                      <td>
                        &nbsp;
                      </td>
                      <td>
                        &nbsp;
                      </td>
                      <td align="right">
                      <b>
                          <NumberFormat style={{color:TAppColor}} value={Number(this.state.APP_JAN_TOT + this.state.APP_FEB_TOT + this.state.APP_MAR_TOT +this.state.APP_APR_TOT + this.state.APP_MAY_TOT + this.state.APP_JUN_TOT +this.state.APP_JUL_TOT + this.state.APP_AUG_TOT + this.state.APP_SEP_TOT +this.state.APP_OCT_TOT + this.state.APP_NOV_TOT + this.state.APP_DEC_TOT).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
                      
                      </b>
                      </td>
                      <td align="right">
                        <b>
                          <NumberFormat style={{color:totalDiffColor}} value={Number((this.state.JAN_TOT + this.state.FEB_TOT + this.state.MAR_TOT +this.state.APR_TOT + this.state.MAY_TOT + this.state.JUN_TOT +this.state.JUL_TOT + this.state.AUG_TOT + this.state.SEP_TOT +this.state.OCT_TOT + this.state.NOV_TOT + this.state.DEC_TOT) -
                             (this.state.APP_JAN_TOT + this.state.APP_FEB_TOT + this.state.APP_MAR_TOT +this.state.APP_APR_TOT + this.state.APP_MAY_TOT + this.state.APP_JUN_TOT +this.state.APP_JUL_TOT + this.state.APP_AUG_TOT + this.state.APP_SEP_TOT +this.state.APP_OCT_TOT + this.state.APP_NOV_TOT + this.state.APP_DEC_TOT )).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                       </b>
                      </td>
                    </tr>
                  </table>
            </td>
          </tr>
          <tr style={{width:"100%"}}>
            <td style={{width:"100%"}}>
                <table style={{width:"100%"}}>
                  <tr style={{width:"100%"}}>
                    <td style={{width:"100%"}}>
                            <b>
                              Comments:
                            </b>
                    </td>
                  </tr>
                  <tr style={{width:"100%"}}>
                    <td style={{width:"100%"}}>
                        <TextField disabled={requestFieldsDisabled}  multiline={true} label="" value={this.state.COMMENTS} onChange={this.handleChangeCOMMENT.bind(this)}></TextField>
                    </td>
                  </tr>
                </table>

            </td>
          </tr>
          <tr>
            <td>
              <table  style={{width:"100%"}}>
                <tr  style={{width:"100%"}}>
                  <td  style={{width:"100%"}}>
                    <b>
                      Approved:
                    </b>
                  </td>
                </tr>
                <tr style={{width:"100%"}}>
                  <td style={{width:"100%"}}>
                    <ComboBox
                    label=""
                    key={'Approved'}
                    autoComplete={true ? 'on' : 'off'}
                    options={this.state.approvalOptions}
                    selectedKey={strApproved}
                    disabled={ApprovedFieldDisabled}
                    onChange={this.comboChange.bind(this)}
                  />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{width:"100%"}}>
                <tr style={{width:"100%"}}>
                  <td style={{width:"100%"}}>
                            <b>
                              Approval Comments:
                            </b>
                  </td>
                </tr>
                <tr>
                  <td>
                  <TextField disabled={ApprovedFieldDisabled} multiline={true} label="" value={this.state.REASON} ></TextField>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          <tr>
            <td  colSpan={8} >
              <table style={{width:"100%"}}>
                <tr  style={{width:"100%"}}>
                  <td style={{width:"33%"}} align="left">
                    <DefaultButton text="Delete" disabled={requestFieldsDisabled} style={{display:displayDelete}} onClick={this.DeleteItem.bind(this)} />
                  </td>
                  <td style={{width:"33%"}} align="center">
                    <DefaultButton text="Cancel" onClick={this.NewItem.bind(this)} />
                  </td>
                  <td style={{width:"33%"}} align="right">
                    <DefaultButton disabled={requestFieldsDisabled}  text={buttonText} onClick={this.UpdateItem.bind(this)} />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

         </table>

        <Dialog hidden={this.state.hideDialog} onDismiss={this._closeDialog} 
                              dialogContentProps={{type: DialogType.normal,title: 'System Message', closeButtonAriaLabel: 'Close', subText: this.state.dialogBoxMsg,}} 
                             modalProps={{titleAriaId: "testingLabelID", subtitleAriaId: "testingLabelIDsub", isBlocking: false, styles: { main: { maxWidth: 450 } },
                             dragOptions: this.state.isDraggable ? this._dragOptions : undefined,}}>
                     <DialogFooter>
                     <DefaultButton onClick={this._closeDialog} text="Close" />
                     </DialogFooter>
                     </Dialog>
                     <Dialog hidden={this.state.hideMsgDialog} onDismiss={this._closeDialog} 
                              dialogContentProps={{type: DialogType.normal,title: 'System Message', closeButtonAriaLabel: 'Close', subText: this.state.dialogBoxMsg,}} 
                             modalProps={{titleAriaId: "testingLabelID", subtitleAriaId: "testingLabelIDsub", isBlocking: false, styles: { main: { maxWidth: 450 } },
                             dragOptions: this.state.isDraggable ? this._dragOptions : undefined,}}>
        </Dialog>
      </div>
    
    );
  }

  public getSLItemCategoryOptions(): IComboBoxOptionLoan[]
  {
    let BClist:any =[];
    let ComOptions:IComboBoxOptionLoan[] = [];
    //let i=this.props.itemCategoryId;
    let response1 : any = this.GetSLItemCategoriesWS().then(
      response => {
        response1 = response;
        response.map(itemY=>{

          let comOption = new IComboBoxOptionLoan();
          comOption.key = itemY.pd_item1; 
          comOption.text = itemY.pd_item1;
          ComOptions = ComOptions.concat(comOption);
        }); 
        let check = "0";
        this.setState({SLItemCategoryOption: ComOptions});
        
      }
    );
    return ComOptions;
  }


  public async GetSLItemCategoriesWS(): Promise<any[]> {
    let WSS = Constants.apiURL + '/GetAllPDItems';
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

  public copyApproved()
  {
    this.setState({APP_JAN_TOT:this.state.JAN_TOT,APP_FEB_TOT:this.state.FEB_TOT,APP_MAR_TOT:this.state.MAR_TOT,APP_APR_TOT:this.state.APR_TOT,APP_MAY_TOT:this.state.MAY_TOT,APP_JUN_TOT:this.state.JUN_TOT,APP_JUL_TOT:this.state.JUL_TOT,APP_AUG_TOT:this.state.AUG_TOT,APP_SEP_TOT:this.state.SEP_TOT,APP_OCT_TOT:this.state.OCT_TOT,APP_NOV_TOT:this.state.NOV_TOT,APP_DEC_TOT:this.state.DEC_TOT
    });
  }


  public NewItem()
  {
    this.setState({
          JAN_TOT:0,FEB_TOT:0,MAR_TOT:0,APR_TOT:0,MAY_TOT:0,JUN_TOT:0,JUL_TOT:0,AUG_TOT:0,SEP_TOT:0,OCT_TOT:0,NOV_TOT:0,DEC_TOT:0,
          APP_JAN_TOT:0,APP_FEB_TOT:0,APP_MAR_TOT:0,APP_APR_TOT:0,APP_MAY_TOT:0,APP_JUN_TOT:0,APP_JUL_TOT:0,APP_AUG_TOT:0,APP_SEP_TOT:0,APP_OCT_TOT:0,APP_NOV_TOT:0,APP_DEC_TOT:0,
          COMMENTS:"", APPROVED:"0", REASON:"",ITEM_DESC:"",SelectedSL:"",SelectedAttendance:"1"});
          this.props.OnChangeItemId('0');
          this._topElement.scrollIntoView();
  }


  public DeleteItem()
  {
    /*
    if(this.state.ITEM_DESC.length==0)
    {
      this.setState({ hideDialog: false, dialogBoxMsg: "Please provide Item name"});
      return 1;
    }
    */

    let response1 : any = this.DeleteItemWS().then(
      response => {
        response1 = response;
        if(response!=null)
        {

          this.props.refreshThis(this.state.ItemsAdded);
          this.setState({ ItemsAdded:(this.state.ItemsAdded +1),hideDialog: false, dialogBoxMsg: "The item has been successfully removed from the system"});
          this._topElement.scrollIntoView();
          //this.setItemsStudentTotal();
        }
      }
    );

  } 

public async DeleteItemWS()
{
  let WSS = Constants.apiURL + '/DeleteItem';


  const requestOptions: IHttpClientOptions = 
  {        
    headers: 
    {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
    {
      ITEM_ID:this.state.itemId
    }
    )
  };

  try{
    return await this.props.budgetAppClient.post(WSS , AadHttpClient.configurations.v1,requestOptions)
    .then((response: HttpClientResponse) => {
      return response.json();
    })
    .then(jsonResponse => {
      return jsonResponse;
    }) as Promise<any>;
    } catch (e )
      {
        console.error(e);
        //let i=0;
        return 1;
        //this.setState({hasError:true, dialogBoxMsg: "Something went wrong, Please refresh the page. If this happens again, please contact your administrator"});
      }
  }


  public UpdateItem()
  {
    if(this.state.ITEM_DESC.length==0 && 
      (this.state.SelectedSL == "Other"))
    {
      this.setState({ hideDialog: false, dialogBoxMsg: "Please provide Item name"});
      return 1;
    }

    if(this.state.SelectedSL == '')
    {
      this.setState({ hideDialog: false, dialogBoxMsg: "Please select an Item"});
      return 1;
    }

    let response1 : any = this.UpdateItemWS().then(
      response => {
        response1 = response;
        if(response!=null)
        {

          this.props.refreshThis(this.state.ItemsAdded);
          //this.setState({ ItemsAdded:(this.state.ItemsAdded +1),hideDialog: false, dialogBoxMsg: "The item has been successfully updated in the system"});
          //this.setItemsStudentTotal();
          this.setState({ ItemsAdded:(this.state.ItemsAdded +1)});
          this.NewItem();
          //window.scroll(0,0);
          this._topElement.scrollIntoView();
          //$("div[data-automation-id='CanvasZone']")
          //$(#s4-workspace).scroll(0,0);
        }
      }
    );

  } 

public async UpdateItemWS()
{
  let WSS = Constants.apiURL + '/AddItemOE';
  let itemText = "";
  if(this.state.SelectedSL== "External technology training" || this.state.SelectedSL == "CFA training" || this.state.SelectedSL == "Health and safety training" || this.state.SelectedSL == "First Aid training" || this.state.SelectedSL == "Outdoors skills training" ||
  this.state.SelectedSL == "Management training" || this.state.SelectedSL == "General workplace skills training" || this.state.SelectedSL == "Consultancies" || this.state.SelectedSL == "Presenters' fees" || this.state.SelectedSL == "Counselling/Pastoral Care training" ||
  this.state.SelectedSL == "Teaching skills development/training" || this.state.SelectedSL == "VCE/IB/VET briefings" || this.state.SelectedSL == "Seminars/Conferences" )
  {
    itemText = this.state.SelectedSL;
    //textboxValue = "";
    //innerItemcomboValue = response1.ITEM_DESC;
  }
  else{
    itemText = this.state.ITEM_DESC;
  }

  const requestOptions: IHttpClientOptions = 
  {        
    headers: 
    {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
    {
      ITEM_ID:this.state.itemId,
      ITEM_DESC: itemText,
      PRIORITY:this.state.PRIORITY,
      ACCOUNT_NO: this.state.AccountNumberId,
      COST_CENTRE: this.state.costCenterId,
      EXPENSE_CAT: 3 ,
      YEAR_USED: this.props.YearId,
      JAN_TOT:this.state.JAN_TOT,
      FEB_TOT:this.state.FEB_TOT,
      MAR_TOT:this.state.MAR_TOT,
      APR_TOT:this.state.APR_TOT,
      MAY_TOT:this.state.MAY_TOT,
      JUN_TOT:this.state.JUN_TOT,
      JUL_TOT:this.state.JUL_TOT,
      AUG_TOT:this.state.AUG_TOT,
      SEP_TOT:this.state.SEP_TOT,
      OCT_TOT:this.state.OCT_TOT,
      NOV_TOT:this.state.NOV_TOT,
      DEC_TOT:this.state.DEC_TOT,
      COMMENTS: this.state.COMMENTS,
      APP_JAN_TOT:this.state.APP_JAN_TOT,
      APP_FEB_TOT:this.state.APP_FEB_TOT,
      APP_MAR_TOT:this.state.APP_MAR_TOT,
      APP_APR_TOT:this.state.APP_APR_TOT,
      APP_MAY_TOT:this.state.APP_MAY_TOT,
      APP_JUN_TOT:this.state.APP_JUN_TOT,
      APP_JUL_TOT:this.state.APP_JUL_TOT,
      APP_AUG_TOT:this.state.APP_AUG_TOT,
      APP_SEP_TOT:this.state.APP_SEP_TOT,
      APP_OCT_TOT:this.state.APP_OCT_TOT,
      APP_NOV_TOT:this.state.APP_NOV_TOT,
      APP_DEC_TOT:this.state.APP_DEC_TOT,
      APPROVED: this.state.APPROVED,
      REASON: "",
      ADDED_BY: "",
      ADDED_DATE: "2020-03-21T23:37:35.169Z",
      APPROVED_BY: "",
      APPROVED_DATE: "2020-03-21T23:37:35.169Z",
      MODIFIED_BY: "",
      MODIFIED_DATE: "2020-03-21T23:37:35.169Z",
      SALARY_SYSTEM: 0,
      QUANTITY:parseInt(this.state.SelectedAttendance)
    }
    )
  };

  let i=0;
  try{
    return await this.props.budgetAppClient.post(WSS , AadHttpClient.configurations.v1,requestOptions)
    .then((response: HttpClientResponse) => {
      return response.json();
    })
    .then(jsonResponse => {
      return jsonResponse;
    }) as Promise<any>;
    } catch (e )
      {
        console.error(e);
        //let i=0;
        return 1;
        //this.setState({hasError:true, dialogBoxMsg: "Something went wrong, Please refresh the page. If this happens again, please contact your administrator"});
      }
  

}

  public ChangeItemDesc(evt)
  {
    this.setState({ ITEM_DESC: evt.target.value.substr(0, 300) });
  }

  public OnExpenseTableclick(evt)  {
    
    this.setState({ COMMENTS: evt.target.value.substr(0, 300) });
  
  }


  public handleChangeCOMMENT(evt)  {
    
      this.setState({ COMMENTS: evt.target.value.substr(0, 300) });
    
  }

  public handleChangeREASON(evt)  {
    
    this.setState({ REASON: evt.target.value.substr(0, 300) });
  
}

  public comboChange(evt,Cmb_Selected)
  {
    //this.internalSelectedComboValue = Cmb_Selected.key;
    this.setState({APPROVED:Cmb_Selected.key });
  }

  public comboPRIORITY(evt,Cmb_Selected)
  {
    //this.internalSelectedComboValue = Cmb_Selected.key;
    this.setState({PRIORITY:Cmb_Selected.key });
  }

  public comboAttendance(evt,Cmb_Selected)
  {
    //this.internalSelectedComboValue = Cmb_Selected.key;
    this.setState({SelectedAttendance:Cmb_Selected.key });
  }

  public comboSLItemChange(evt,Cmb_Selected)
  {
    //this.internalSelectedComboValue = Cmb_Selected.key;
    let innerTextboxDisable = true;
    let textboxValue = "";
    if(Cmb_Selected.key  == "External technology training" || Cmb_Selected.key  == "CFA training" || Cmb_Selected.key  == "Health and safety training" || Cmb_Selected.key  == "First Aid training" || Cmb_Selected.key  == "Outdoors skills training" ||
        Cmb_Selected.key  == "Management training" || Cmb_Selected.key  == "General workplace skills training" || Cmb_Selected.key  == "Consultancies" || Cmb_Selected.key  == "Presenters' fees" || Cmb_Selected.key  == "Counselling/Pastoral Care training" ||
        Cmb_Selected.key  == "Teaching skills development/training" || Cmb_Selected.key  == "VCE/IB/VET briefings" || Cmb_Selected.key  == "Seminars/Conferences" )
        {
          innerTextboxDisable = true;
          textboxValue = "";
          //innerItemcomboValue = response1.ITEM_DESC;
        }
        else{
          innerTextboxDisable = false;
        }
    this.setState({SelectedSL:Cmb_Selected.key,otherTextBoxDisable:innerTextboxDisable, ITEM_DESC:textboxValue });
  }

  private _showDialog = (): void => {
    this.setState({ hideDialog: false });
  }

  private _closeDialog = (): void => {
    this.setState({ hideDialog: true });
  }

  public getPriorityOptions(): IComboBoxOptionLoan[]
  {
    
          let ComOptions:IComboBoxOptionLoan[] = [];
          let comOption = new IComboBoxOptionLoan();
          comOption.key = "1"; 
          comOption.text = "1";
          ComOptions = ComOptions.concat(comOption);
          comOption = new IComboBoxOptionLoan();
          comOption.key = "2"; 
          comOption.text = "2";
          ComOptions = ComOptions.concat(comOption);
          comOption = new IComboBoxOptionLoan();
          comOption.key = "3"; 
          comOption.text = "3";
          ComOptions = ComOptions.concat(comOption);
          comOption = new IComboBoxOptionLoan();
          comOption.key = "4"; 
          comOption.text = "4";
          ComOptions = ComOptions.concat(comOption);
          comOption = new IComboBoxOptionLoan();
          comOption.key = "5"; 
          comOption.text = "5";
          ComOptions = ComOptions.concat(comOption);

    return ComOptions;
  }

  public getApprovalOptions(): IComboBoxOptionLoan[]
  {
    
          let ComOptions:IComboBoxOptionLoan[] = [];
          let comOption = new IComboBoxOptionLoan();
          comOption.key = "0"; 
          comOption.text = "Not Assessed";
          ComOptions = ComOptions.concat(comOption);
          comOption = new IComboBoxOptionLoan();
          comOption.key = "1"; 
          comOption.text = "Approved";
          ComOptions = ComOptions.concat(comOption);
          comOption = new IComboBoxOptionLoan();
          comOption.key = "2"; 
          comOption.text = "Not Approved";
          ComOptions = ComOptions.concat(comOption);
    
    return ComOptions;
  }

  public getItem(itemId): IComboBoxOptionLoan[]
  {
    
    let BClist:any =[];
    let ComOptions:IComboBoxOptionLoan[] = [];
    let i="0";
    let response1 : any = this.getItemWS(itemId).then(
      response => {
        response1 = response;
        let innerItemDesc = "";
        let innerItemcomboValue = "";
        let textboxDisabled = true;
        if (itemId == '0')
        {
          innerItemcomboValue = "";  
          textboxDisabled = true;
        }
        else if(response1.ITEM_DESC == "External technology training" || response1.ITEM_DESC == "CFA training" || response1.ITEM_DESC == "Health and safety training" || response1.ITEM_DESC == "First Aid training" || response1.ITEM_DESC == "Outdoors skills training" ||
            response1.ITEM_DESC == "Management training" || response1.ITEM_DESC == "General workplace skills training" || response1.ITEM_DESC == "Consultancies" || response1.ITEM_DESC == "Presenters' fees" || response1.ITEM_DESC == "Counselling/Pastoral Care training" ||
            response1.ITEM_DESC == "Teaching skills development/training" || response1.ITEM_DESC == "VCE/IB/VET briefings" || response1.ITEM_DESC == "Seminars/Conferences" )
        {
          innerItemDesc = "";
          innerItemcomboValue = response1.ITEM_DESC;
          textboxDisabled = true;
        }
        else {
          innerItemDesc = response1.ITEM_DESC;
          innerItemcomboValue = "Other";
          textboxDisabled = false;
        }
        
        let attendanceNumber = 1;
        if(response1.QUANTITY == null)
        {
          
        }
        else if (response1.QUANTITY == 0)
        {
          attendanceNumber = 1;
        }
        else
        {
          attendanceNumber = response1.QUANTITY;
        }


        this.setState({itemId:itemId, item: response, 
          JAN_TOT:response1.JAN_TOT,FEB_TOT:response1.FEB_TOT,MAR_TOT:response1.MAR_TOT,APR_TOT:response1.APR_TOT,MAY_TOT:response1.MAY_TOT,JUN_TOT:response1.JUN_TOT,JUL_TOT:response1.JUL_TOT,AUG_TOT:response1.AUG_TOT,SEP_TOT:response1.SEP_TOT,OCT_TOT:response1.OCT_TOT,NOV_TOT:response1.NOV_TOT,DEC_TOT:response1.DEC_TOT,
          APP_JAN_TOT:response1.APP_JAN_TOT,APP_FEB_TOT:response1.APP_FEB_TOT,APP_MAR_TOT:response1.APP_MAR_TOT,APP_APR_TOT:response1.APP_APR_TOT,APP_MAY_TOT:response1.APP_MAY_TOT,APP_JUN_TOT:response1.APP_JUN_TOT,APP_JUL_TOT:response1.APP_JUL_TOT,APP_AUG_TOT:response1.APP_AUG_TOT,APP_SEP_TOT:response1.APP_SEP_TOT,APP_OCT_TOT:response1.APP_OCT_TOT,APP_NOV_TOT:response1.APP_NOV_TOT,APP_DEC_TOT:response1.APP_DEC_TOT,
          COMMENTS:response1.COMMENTS, APPROVED:response1.APPROVED, REASON:response1.REASON,ITEM_DESC:innerItemDesc,PRIORITY:response1.PRIORITY, SelectedSL: innerItemcomboValue, otherTextBoxDisable:textboxDisabled,
          SelectedAttendance:attendanceNumber.toString()

        });
        
      }
    );
    return ComOptions;
  }

  public async getItemWS(itemId): Promise<any[]> {
    let WSS = Constants.apiURL + '/GetItemById?itemId=' + itemId;
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

    public IsbudgetYear(): IComboBoxOptionLoan[]
    {
      
      let BClist:any =[];
      let ComOptions:IComboBoxOptionLoan[] = [];
      let i="0";
      let response1 : any = this.IsbudgetYearWS(this.props.YearId).then(
        response => {
          response1 = response;
          
          this.setState({AllowedBudgetYear:response1});
        });
      return ComOptions;
    }
  
    public async IsbudgetYearWS(itemId): Promise<any[]> {
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

      public IsAdmin(): IComboBoxOptionLoan[]
    {
      
      let BClist:any =[];
      let ComOptions:IComboBoxOptionLoan[] = [];
      let i="0";
      let response1 : any = this.IsAdminWS(this.props.YearId).then(
        response => {
          response1 = response;
          
          this.setState({IsAdmin:response1});
        });
      return ComOptions;
    }
  
    public async IsAdminWS(itemId): Promise<any[]> {
      let WSS = Constants.apiURL + '/IsAdmin';
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

      public IsBudgetReadOnly(): IComboBoxOptionLoan[]
    {
      
      let BClist:any =[];
      let ComOptions:IComboBoxOptionLoan[] = [];
      let i="0";
      let response1 : any = this.IsBudgetReadOnlyWS(this.props.YearId).then(
        response => {
          response1 = response;
          
          this.setState({IsBudgetReadOnly:response1});
        });
      return ComOptions;
    }
  
    public async IsBudgetReadOnlyWS(itemId): Promise<any[]> {
      let WSS = Constants.apiURL + '/IsBudgetReadOnly';
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


    public handleChangeJAN_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.JAN_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ JAN_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeFEB_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.FEB_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ FEB_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeMAR_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.MAR_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ MAR_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeAPR_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.APR_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ APR_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeMAY_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.MAY_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ MAY_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeJUN_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.JUN_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ JUN_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeJUL_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.JUL_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ JUL_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeAUG_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.AUG_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ AUG_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeSEP_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.SEP_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ SEP_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeOCT_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.OCT_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ OCT_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeNOV_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.NOV_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ NOV_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeDEC_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.DEC_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ DEC_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeAPP_JAN_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.APP_JAN_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ APP_JAN_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeAPP_FEB_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.APP_FEB_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ APP_FEB_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeAPP_MAR_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.APP_MAR_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ APP_MAR_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeAPP_APR_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.APP_APR_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ APP_APR_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeAPP_MAY_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.APP_MAY_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ APP_MAY_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeAPP_JUN_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.APP_JUN_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ APP_JUN_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeAPP_JUL_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.APP_JUL_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ APP_JUL_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeAPP_AUG_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.APP_AUG_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ APP_AUG_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeAPP_SEP_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.APP_SEP_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ APP_SEP_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeAPP_OCT_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.APP_OCT_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ APP_OCT_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeAPP_NOV_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.APP_NOV_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ APP_NOV_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public handleChangeAPP_DEC_TOT(evt)  {
      if( isNaN(evt.target.value.substr(0, 100)) )
      {
        //alert("Please provide numeric value for Loan Amount")
        evt.target.value = this.state.APP_DEC_TOT;
        this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value"});
      }
      else
      {
        this.setState({ APP_DEC_TOT: parseInt(evt.target.value.substr(0, 100)) });
      }
      //alert(evt.target.value.substr(0, 100)); 
    }

    public getAttendanceOptions(): IComboBoxOptionLoan[]
    {
      
            let ComOptions:IComboBoxOptionLoan[] = [];
            let comOption = new IComboBoxOptionLoan();
      comOption = new IComboBoxOptionLoan();comOption.key ="1"; comOption.text = "1";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="2"; comOption.text = "2";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="3"; comOption.text = "3";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="4"; comOption.text = "4";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="5"; comOption.text = "5";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="6"; comOption.text = "6";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="7"; comOption.text = "7";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="8"; comOption.text = "8";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="9"; comOption.text = "9";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="10"; comOption.text = "10";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="11"; comOption.text = "11";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="12"; comOption.text = "12";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="13"; comOption.text = "13";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="14"; comOption.text = "14";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="15"; comOption.text = "15";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="16"; comOption.text = "16";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="17"; comOption.text = "17";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="18"; comOption.text = "18";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="19"; comOption.text = "19";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="20"; comOption.text = "20";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="21"; comOption.text = "21";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="22"; comOption.text = "22";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="23"; comOption.text = "23";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="24"; comOption.text = "24";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="25"; comOption.text = "25";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="26"; comOption.text = "26";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="27"; comOption.text = "27";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="28"; comOption.text = "28";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="29"; comOption.text = "29";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="30"; comOption.text = "30";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="31"; comOption.text = "31";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="32"; comOption.text = "32";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="33"; comOption.text = "33";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="34"; comOption.text = "34";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="35"; comOption.text = "35";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="36"; comOption.text = "36";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="37"; comOption.text = "37";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="38"; comOption.text = "38";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="39"; comOption.text = "39";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="40"; comOption.text = "40";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="41"; comOption.text = "41";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="42"; comOption.text = "42";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="43"; comOption.text = "43";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="44"; comOption.text = "44";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="45"; comOption.text = "45";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="46"; comOption.text = "46";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="47"; comOption.text = "47";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="48"; comOption.text = "48";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="49"; comOption.text = "49";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="50"; comOption.text = "50";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="51"; comOption.text = "51";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="52"; comOption.text = "52";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="53"; comOption.text = "53";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="54"; comOption.text = "54";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="55"; comOption.text = "55";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="56"; comOption.text = "56";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="57"; comOption.text = "57";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="58"; comOption.text = "58";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="59"; comOption.text = "59";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="60"; comOption.text = "60";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="61"; comOption.text = "61";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="62"; comOption.text = "62";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="63"; comOption.text = "63";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="64"; comOption.text = "64";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="65"; comOption.text = "65";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="66"; comOption.text = "66";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="67"; comOption.text = "67";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="68"; comOption.text = "68";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="69"; comOption.text = "69";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="70"; comOption.text = "70";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="71"; comOption.text = "71";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="72"; comOption.text = "72";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="73"; comOption.text = "73";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="74"; comOption.text = "74";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="75"; comOption.text = "75";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="76"; comOption.text = "76";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="77"; comOption.text = "77";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="78"; comOption.text = "78";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="79"; comOption.text = "79";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="80"; comOption.text = "80";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="81"; comOption.text = "81";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="82"; comOption.text = "82";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="83"; comOption.text = "83";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="84"; comOption.text = "84";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="85"; comOption.text = "85";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="86"; comOption.text = "86";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="87"; comOption.text = "87";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="88"; comOption.text = "88";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="89"; comOption.text = "89";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="90"; comOption.text = "90";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="91"; comOption.text = "91";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="92"; comOption.text = "92";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="93"; comOption.text = "93";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="94"; comOption.text = "94";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="95"; comOption.text = "95";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="96"; comOption.text = "96";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="97"; comOption.text = "97";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="98"; comOption.text = "98";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="99"; comOption.text = "99";  ComOptions = ComOptions.concat(comOption);
      comOption = new IComboBoxOptionLoan();comOption.key ="100"; comOption.text = "100";  ComOptions = ComOptions.concat(comOption);
      
      
      return ComOptions;
    }



}
