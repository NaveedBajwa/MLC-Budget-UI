
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
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
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
import { AadHttpClient, IHttpClientOptions } from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Constants } from '../../components/Constants';


export interface IExpenseTableOEProps {
  
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

export interface IExpenseTableOEState {
  trColor:string;
  items:any[];
  itemsTotal:any[];
  itemsStudentTotal:any[];
  itemsStudentNumber:any;
  costCenterId:string;
  budgetYearId:string;
  BudgetYearText:string;
  Q1ST:number;
  Q2ST:number;
  Q3ST:number;
  Q4ST:number;
  hideDialog:boolean;
  isDraggable: boolean;
  hideMsgDialog: boolean;
  dialogBoxMsg: string;
  hideDataMsgDialog:boolean;
  studtot_id:string;
}

export class IComboBoxOptionLoan implements IComboBoxOption
    {
      public key: string;
      public text : string;
    }


export class ExpenseTableOE extends React.Component<IExpenseTableOEProps, IExpenseTableOEState> {
  
  constructor(props: IExpenseTableOEProps) {
    super(props);
    this.state = {studtot_id:"0", hideDataMsgDialog:true, hideDialog:true,hideMsgDialog:true, isDraggable:true, dialogBoxMsg:"Something went Wrong, Please try again" , Q1ST:0, Q2ST:0, Q3ST:0, Q4ST:0,itemsStudentNumber:null, trColor:"white",items:[],itemsTotal:[],itemsStudentTotal:[], costCenterId:this.props.costCenterId,budgetYearId:this.props.budgetYearId,BudgetYearText:this.props.budgetYearText};
  }

  private _dragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
  };

  public componentDidMount() {
    this.setState({hideMsgDialog: false, dialogBoxMsg: "Please wait while the data is being loaded. This message will close automatically." });
    this.setItems();
    this.setItemsTotal();
    this.setItemsStudentTotal();
    this.setItemsStudentNumber();
  }

  public renderTableData() {
    if(this.state.items ==null || this.state.items.length == 0)
    {
      return(
        <tr   >
                          <td style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" }} >
                           <b>&nbsp;</b>
                          </td>
                          <td style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" }} >
                           <b>&nbsp;</b>
                          </td >
                          <td style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" }} >
                           <b>&nbsp;</b>
                          </td>
                          <td style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" }} >
                           <b>&nbsp;</b>
                          </td>
                          <td style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" }} >
                           <b>&nbsp;</b>
                          </td>
                          <td style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" }} >
                           <b>&nbsp;</b>
                          </td>
                          <td style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" }} >
                           <b>&nbsp;</b>
                          </td>
                          <td style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" }} >
                           <b>&nbsp;</b>
                          </td>
                          <td style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" }} >
                           <b>&nbsp;</b>
                          </td>
                        </tr>
      );
    }
    return this.state.items.map((item, index) => {
        return (
        <tr key={index} data-item={item.account} style={{cursor:"pointer"}} onPointerLeave={this.resetColor.bind(this)} onPointerEnter={this.changeColor.bind(this)} >
        <td key={index} data-item={item.account} title={item.account} onClick={this.OnRowClick.bind(this)} style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" }}>
          {item.account}
        </td>
        <td  key={index} data-item={item.account} title={item.account} onClick={this.OnRowClick.bind(this)} style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid"}}>
          {item.itemCategory}
        </td>
        <td key={index} data-item={item.account} title={item.account} onClick={this.OnRowClick.bind(this)} style={{border:"1px", borderColor:"black",borderCollapse:"collapse" , borderStyle:"solid" }} align="right">
        <NumberFormat value={Number(item.term1).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </td>
        <td key={index} data-item={item.account} title={item.account} onClick={this.OnRowClick.bind(this)} style={{border:"1px", borderColor:"black",borderCollapse:"collapse" , borderStyle:"solid" }} align="right">
        <NumberFormat value={Number(item.term2).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </td>
        <td key={index} data-item={item.account} title={item.account} onClick={this.OnRowClick.bind(this)} style={{border:"1px", borderColor:"black",borderCollapse:"collapse" , borderStyle:"solid" }} align="right">
        <NumberFormat value={Number(item.term3).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          
        </td>
        <td key={index} data-item={item.account} title={item.account} onClick={this.OnRowClick.bind(this)} style={{border:"1px", borderColor:"black",borderCollapse:"collapse" , borderStyle:"solid" }} align="right">
        <NumberFormat value={Number(item.term4).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          
        </td>
        <td key={index} data-item={item.account} title={item.account} onClick={this.OnRowClick.bind(this)} style={{border:"1px", borderColor:"black",borderCollapse:"collapse" , borderStyle:"solid" }} align="right">
        <NumberFormat value={Number(item.total).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
        </td>
        <td key={index} data-item={item.account} title={item.account} onClick={this.OnRowClick.bind(this)} style={{border:"1px", borderColor:"black",borderCollapse:"collapse" , borderStyle:"solid" }} align="right">
        <NumberFormat value={Number(item.approvedTotal).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
          
        </td>
        <td key={index} data-item={item.account} title={item.account} style={{border:"1px", borderColor:"black",borderCollapse:"collapse" , borderStyle:"solid" }} align="right">
        <NumberFormat value={Number(item.lastFYBudget).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
          
        </td>
      </tr>  );
      }
    );
  }

  public renderTotalData() {
    
    return this.state.itemsTotal.map((item, index) => {
        return (
        <tr >
        <td colSpan={2} align="right">
          <b>Totals</b>
        </td>
        <td  align="right">
        <NumberFormat value={Number(item.term1).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
          
        </td>
        <td  align="right">
        <NumberFormat value={Number(item.term2).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
          
        </td>
        <td  align="right">
        <NumberFormat value={Number(item.term3).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
          
        </td>
        <td align="right">
        <NumberFormat value={Number(item.term4).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
          
        </td>
        <td align="right">
        <NumberFormat value={Number(item.total).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
          
        </td>
        <td align="right">
        <NumberFormat value={Number(item.approvedTotal).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
          
        </td>
        <td align="right">
        <NumberFormat value={Number(item.lastFYBudget).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
        </td>
      </tr>  );
      }
    );
  }

  public renderTotalStudentData() {
    
    return this.state.itemsStudentTotal.map((item, index) => {
        return (
        <tr >
          <td colSpan={2}>
            <table style={{width:"100%"}}>
              <tr  style={{width:"100%"}}>
                <td  style={{width:"65%"}}>
                  <DefaultButton text="View Previous Year's Accounts"  allowDisabledFocus href="https://www.mymlc.net/finance/account_details.cfm" target="_blank" />
                </td>
                <td align="right"  style={{width:"35%"}}>
                  <b>Per Student Totals</b>
                </td>    
              </tr>
            </table>
          </td>
        <td  align="right">
        <NumberFormat value={Number(item.term1).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
          
        </td>
        <td  align="right">
        <NumberFormat value={Number(item.term2).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
          
        </td>
        <td  align="right">
        <NumberFormat value={Number(item.term3).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
          
        </td>
        <td align="right">
        <NumberFormat value={Number(item.term4).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
          
        </td>
        <td align="right">
        <NumberFormat value={Number(item.total).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
          
        </td>
        <td align="right">
        <NumberFormat value={Number(item.approvedTotal).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
          
        </td>
        <td align="right">
        <NumberFormat value={Number(item.lastFYBudget).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
        </td>
      </tr>  );
      }
    );
  }

  public renderStudentNumberData() {
    
    if (this.state.itemsStudentNumber == null)
    {
      return (
        <tr>
        <td style={{width:"18%"}}>
          &nbsp;
        </td>
        <td style={{width:"18%"}}>
          <b>Student No's: </b>
        </td>
        <td style={{width:"9%"}}>
          <TextField id="Q1SN" value="0" style={{textAlign:"right"}} onChange={this.handleChangeQ1ST.bind(this)} />
        </td>
        <td style={{width:"9%"}}>
        <TextField id="Q2SN"  value="0" style={{textAlign:"right"}} onChange={this.handleChangeQ2ST.bind(this)} />
        </td>
        <td style={{width:"9%"}}>
        <TextField value="0"  id="Q3SN" style={{textAlign:"right"}} onChange={this.handleChangeQ3ST.bind(this)} />
        </td>
        <td style={{width:"9%"}}>
        <TextField value="0" style={{textAlign:"right"}}  id="Q4SN" onChange={this.handleChangeQ4ST.bind(this)} />
        </td>
        <td style={{width:"9%"}} colSpan={2}>
          <DefaultButton style={{backgroundColor:"#D3D3D3"}} text="Update Student Nos" onClick={this.UpdateStudentNo.bind(this)} />
        </td>
        <td style={{width:"9%"}}>
          &nbsp;
        </td>
        <td style={{width:"10%"}}>
          &nbsp;
        </td>
      </tr>
    
    );

    }
    /*
    else if(this.state.itemsStudentNumber.length == 0)
    {
      return (
        <tr>
        <td style={{width:"18%"}}>
          &nbsp;
        </td>
        <td style={{width:"18%"}}>
          Student No's: 
        </td>
        <td style={{width:"9%"}}>
          <TextField value="0"  style={{textAlign:"right"}}  id="Q1SN" />
        </td>
        <td style={{width:"9%"}}>
        <TextField value="0"  style={{textAlign:"right"}}  id="Q2SN" />
        </td>
        <td style={{width:"9%"}}>
        <TextField value="0"  style={{textAlign:"right"}}  id="Q3SN"/>
        </td>
        <td style={{width:"9%"}}>
        <TextField value="0" style={{textAlign:"right"}}  id="Q4SN"/>
        </td>
        <td style={{width:"9%"}}  colSpan={2}>
          <DefaultButton style={{backgroundColor:"#D3D3D3"}} text="Update Student Nos" />
        </td>
        
        <td style={{width:"10%"}}>
          &nbsp;
        </td>
      </tr>
    
    );
    }*/
    else
    {
      let t1 = 0;
      let t2 = 0;
      let t3 = 0;
      let t4 = 0;
      
      if(this.state.itemsStudentNumber != null)
      {
        if(this.state.Q1ST != null )
        {
          if  (this.state.Q1ST != 0)
          {
            t1 = this.state.Q1ST;
          }
        }
        if(this.state.Q2ST != null )
        {
          if  (this.state.Q2ST != 0)
          {
            t2 = this.state.Q2ST;
          }
        }
        if(this.state.Q3ST != null )
        {
          if  (this.state.Q3ST != 0)
          {
            t3 = this.state.Q3ST;
          }
        }
        if(this.state.Q4ST != null )
        {
          if  (this.state.Q4ST != 0)
          {
            t4 = this.state.Q4ST;
          }
        }
      } 
      return (
        <tr>
        <td style={{width:"10%"}}>
          &nbsp;
        </td>
        <td style={{width:"28%"}}>
          <b>Student No's: </b>
        </td>
        <td style={{width:"8%"}}>
          <TextField value={t1.toString()} style={{textAlign:"right"}} onChange={this.handleChangeQ1ST.bind(this)} id="Q1SN"/>
        </td>
        <td style={{width:"8%"}}>
        <TextField value={t2.toString()} style={{textAlign:"right"}}  id="Q2SN" onChange={this.handleChangeQ2ST.bind(this)}/>
        </td>
        <td style={{width:"8%"}}>
        <TextField value={t3.toString()} style={{textAlign:"right"}}  id="Q3SN" onChange={this.handleChangeQ3ST.bind(this)}/>
        </td>
        <td style={{width:"8%"}}>
        <TextField value={t4.toString()} style={{textAlign:"right"}}  id="Q4SN" onChange={this.handleChangeQ4ST.bind(this)}/>
        </td>
        <td style={{width:"10%"}} colSpan={2}>
          <DefaultButton style={{backgroundColor:"#D3D3D3"}}  text="Update Student Nos" onClick={this.UpdateStudentNo.bind(this)} />
        </td>
        <td style={{width:"10%"}}>
          &nbsp;
        </td>
      </tr>
    
    );
    }
    
  }

  public render(): JSX.Element {
    if(this.props.costCenterId != this.state.costCenterId && this.props.costCenterId != "abc")
    {
      this.setState({costCenterId:this.props.costCenterId,hideMsgDialog: false, dialogBoxMsg: "Please wait while the data is being loaded. This message will close automatically. "});
      this.setItems();
      this.setItemsTotal();
      this.setItemsStudentTotal();
      this.setItemsStudentNumber();
    }
    if(this.props.budgetYearText != this.state.BudgetYearText && this.props.costCenterId != "abc")
    {
      this.setState({budgetYearId:this.props.budgetYearId, BudgetYearText:this.props.budgetYearText,hideMsgDialog: false, dialogBoxMsg: "Please wait while the data is being loaded. This message will close automatically." });
      this.setItems();
      this.setItemsTotal();
      this.setItemsStudentTotal();
      this.setItemsStudentNumber();
    }

   
    return (
      <div>
              <table style={{width:"100%", borderStyle:"solid", border:"1px", borderColor:"black",borderCollapse:"collapse" }} >
                
                {this.renderStudentNumberData()}

                <tr  style={{border:1, backgroundColor:"#D3D3D3",paddingTop:3}} >
                  <td style={{border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid", width:"10%"  }}>
                   <b>ACCOUNT CODE</b>
                  </td>
                  <td style={{border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid", width:"28%"  }}>
                    <b>ITEM CATEGORY</b>
                  </td>
                  <td align="right" style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" , width:"8%" }} > 
                    <b>TERM 1 </b>
                  </td>
                  <td align="right" style={{border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" , width:"8%" }}>
                  <b>TERM 2 </b>
                  </td>
                  <td align="right" style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid", width:"8%"  }}>
                  <b>TERM 3 </b>
                  </td>
                  <td align="right" style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid", width:"8%"  }}>
                  <b> TERM 4 </b>
                  </td>
                  <td align="right" style={{border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" , width:"10%" }}>
                    <b>TOTAL </b>
                  </td>
                  <td align="right" style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" , width:"10%" }}>
                    <b>APPR TOTAL</b>
                  </td>
                  <td align="right" style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" , width:"10%" }}>
                    <b>{((parseInt(this.state.BudgetYearText))-1)} BUDGET</b>
                  </td>
                </tr>

                {
                  this.renderTableData()
                }
                <tr>
                    <td colSpan={8}>&nbsp;</td>
                </tr>
                  {
                    this.renderTotalData()
                  }
                  {
                    this.renderTotalStudentData()
                  }
                
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
                              dialogContentProps={{type: DialogType.normal,title: 'Loading Data', closeButtonAriaLabel: 'Close', subText: this.state.dialogBoxMsg,}} 
                             modalProps={{titleAriaId: "testingLabelID", subtitleAriaId: "testingLabelIDsub", isBlocking: false, styles: { main: { maxWidth: 450,backgroundColor:"#CCCCCC" } },
                             dragOptions: this.state.isDraggable ? this._dragOptions : undefined,}}>
                     </Dialog>
                     <Dialog hidden={this.state.hideDataMsgDialog} onDismiss={this._closeDialog} 
                              dialogContentProps={{type: DialogType.normal,title: 'Data Saved', closeButtonAriaLabel: 'Close', subText: this.state.dialogBoxMsg,}} 
                             modalProps={{titleAriaId: "testingLabelID", subtitleAriaId: "testingLabelIDsub", isBlocking: false, styles: { main: { maxWidth: 450,backgroundColor:"#CCCCCC" } },
                             dragOptions: this.state.isDraggable ? this._dragOptions : undefined,}}>
                     <DialogFooter>
                     <DefaultButton onClick={this._closeDialog} text="Close" />
                     </DialogFooter>
                     </Dialog>
                     </div>
              
      );
  }

  private _showDialog = (): void => {
    this.setState({ hideDialog: false });
  }

  private _closeDialog = (): void => {
    this.setState({ hideDialog: true,hideMsgDialog:true, hideDataMsgDialog:true });
  }
  public setItems()
  {
    let response1 : any = this.SetItemsWS().then(
      response => {
        response1 = response;
        this.setState({items: response,hideDialog: true,hideMsgDialog:true, hideDataMsgDialog:true});
      }
    );
  }

  public async SetItemsWS(): Promise<any[]> {
    //let WSS = Constants.apiURL + '/GetExpenseTableByBudgetCategory_CostCentre_FY?budgetCategory=' + this.props.budgetCategoryId + '&costCenter=103&FY=2021';
    if(this.props.costCenterId == "abc")
    {
      return [];
    }
    //let WSS = Constants.apiURL + '/GetExpenseTableByBudgetCategory_CostCentre_FY?budgetCategory=' + this.props.budgetCategoryId + '&costCenter='+ 
    //    this.props.costCenterId +'&FY=' + this.props.budgetYearText;
    let WSS = Constants.apiURL + '/GetExpenseTableByBudgetCategory_CostCentre_FY3?budgetCategory=' + this.props.budgetCategoryId + '&costCenter='+ 
        this.props.costCenterId +'&FY=' + this.props.budgetYearText;
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



// These two functions need no customization.
public changeColor(e){
  //this.setState({trColor:'#D3D3D3'});
  //e.currentTarget.setAttribute("style", "background-color:\""+ this.state.trColor + "\";" );
  e.currentTarget.bgColor = "#D3D3D3";
  let i:0;
}

public resetColor(e){
  //this.setState({trColor:'white'});
  //e.target.setAttribute("style", "background-color:\""+ this.state.trColor + "\";" );
  e.currentTarget.bgColor = "white";
}

public OnRowClick(e)
{ 
  const accountCode = e.currentTarget.title;
  this.props.OnChangeExpenseInputView(true,accountCode,'0');

}

public setItemsTotal()
{
  let response1 : any = this.SetItemsTotalWS().then(
    response => {
      response1 = response;
      this.setState({itemsTotal: response});
    }
  );
}

public async SetItemsTotalWS(): Promise<any[]> {
  //let WSS = Constants.apiURL + '/GetExpenseTableByBudgetCategory_CostCentre_FY?budgetCategory=' + this.props.budgetCategoryId + '&costCenter=103&FY=2021';
  if(this.props.costCenterId == "abc")
  {
    return [];
  }
  let WSS = Constants.apiURL + '/GetExpenseTableByBudgetCategory_CostCentre_FY_Total?budgetCategory=' + this.props.budgetCategoryId + '&costCenter='+ 
      this.props.costCenterId +'&FY=' + this.props.budgetYearText;
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

  public setItemsStudentTotal()
  {
    let response1 : any = this.SetItemsStudentTotalWS().then(
      response => {
        response1 = response;
        this.setState({itemsStudentTotal: response});
      }
    );
  }
  
  public async SetItemsStudentTotalWS(): Promise<any[]> {
    //let WSS = Constants.apiURL + '/GetExpenseTableByBudgetCategory_CostCentre_FY?budgetCategory=' + this.props.budgetCategoryId + '&costCenter=103&FY=2021';
    if(this.props.costCenterId == "abc")
    {
      return [];
    }
    let WSS = Constants.apiURL + '/GetExpenseTableByBudgetCategory_CostCentre_FY_PerStudent?budgetCategory=' + this.props.budgetCategoryId + '&costCenter='+ 
        this.props.costCenterId +'&FY=' + this.props.budgetYearText;
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

    public setItemsStudentNumber()
    {
      let response1 : any = this.setItemsStudentNumberWS().then(
        response => {
          response1 = response;
          if(response!=null)
          {
            this.setState({Q1ST: response.t1_total,Q2ST:response.t2_total, Q3ST:response.t3_total, Q4ST:response.t4_total, itemsStudentNumber:response ,studtot_id: response.studtot_id});
          }
        }
      );
    }
    
    public async setItemsStudentNumberWS(): Promise<any> {
      //let WSS = Constants.apiURL + '/GetExpenseTableByBudgetCategory_CostCentre_FY?budgetCategory=' + this.props.budgetCategoryId + '&costCenter=103&FY=2021';
      if(this.props.costCenterId == "abc")
      {
        return null;
      }
      let WSS = Constants.apiURL + '/GetExpenseTableStudentNumberByCostCentre_FY?&costCenter='+ 
          this.props.costCenterId +'&FY=' + this.props.budgetYearText;
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

      public setItemsStudentNumberInner()
    {
      let response1 : any = this.setItemsStudentNumberInnerWS().then(
        response => {
          response1 = response;
          if(response!=null)
          {
            this.setState({hideMsgDialog: false, dialogBoxMsg: "The Numbers of Students have been successfully updated in the system", Q1ST: response.t1_total,Q2ST:response.t2_total, Q3ST:response.t3_total, Q4ST:response.t4_total, itemsStudentNumber:response ,studtot_id: response.studtot_id});
          }
        }
      );
    }
    
    public async setItemsStudentNumberInnerWS(): Promise<any> {
      //let WSS = Constants.apiURL + '/GetExpenseTableByBudgetCategory_CostCentre_FY?budgetCategory=' + this.props.budgetCategoryId + '&costCenter=103&FY=2021';
      if(this.props.costCenterId == "abc")
      {
        return null;
      }
      let WSS = Constants.apiURL + '/GetExpenseTableStudentNumberByCostCentre_FY?&costCenter='+ 
          this.props.costCenterId +'&FY=' + this.props.budgetYearText;
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

      public handleChangeQ1ST(evt)  {
        if( isNaN(evt.target.value.substr(0, 100)) )
        {
          //alert("Please provide numeric value for Loan Amount")
          evt.target.value = this.state.Q1ST;
          this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value for total Students in Q1"});
        }
        else
        {
          this.setState({ Q1ST: evt.target.value.substr(0, 100) });
        }
        //alert(evt.target.value.substr(0, 100)); 
      }

      public handleChangeQ2ST(evt)  {
        if( isNaN(evt.target.value.substr(0, 100)) )
        {
          //alert("Please provide numeric value for Loan Amount")
          evt.target.value = this.state.Q2ST;
          this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value for total Students in Q1"});
        }
        else
        {
          this.setState({ Q2ST: evt.target.value.substr(0, 100) });
        }
        //alert(evt.target.value.substr(0, 100)); 
      }
      public handleChangeQ3ST(evt)  {
        if( isNaN(evt.target.value.substr(0, 100)) )
        {
          //alert("Please provide numeric value for Loan Amount")
          evt.target.value = this.state.Q3ST;
          this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value for total Students in Q1"});
        }
        else
        {
          this.setState({ Q3ST: evt.target.value.substr(0, 100) });
        }
        //alert(evt.target.value.substr(0, 100)); 
      }
      public handleChangeQ4ST(evt)  {
        if( isNaN(evt.target.value.substr(0, 100)) )
        {
          //alert("Please provide numeric value for Loan Amount")
          evt.target.value = this.state.Q4ST;
          this.setState({ hideDialog: false, dialogBoxMsg: "Please provide a numeric value for total Students in Q1"});
        }
        else
        {
          this.setState({ Q4ST: evt.target.value.substr(0, 100) });
        }
        //alert(evt.target.value.substr(0, 100)); 
      }


      public UpdateStudentNo()
      {
        let response1 : any = this.UpdateStudentNoWS().then(
          response => {
            response1 = response;
            if(response!=null)
            {
              this.setState({ hideDataMsgDialog: false, dialogBoxMsg: "The Numbers of Students have been successfully updated in the system"});
              this.setItemsStudentTotal();
            }
          }
        );

      } 

    public async UpdateStudentNoWS()
    {
      let WSS = Constants.apiURL + '/UpdateStudentTotals';


      const requestOptions: IHttpClientOptions = 
      {        
        headers: 
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
        {
          studtot_id: this.state.studtot_id,
          t1_total: this.state.Q1ST,
          t2_total: this.state.Q2ST,
          t3_total: this.state.Q3ST,
          t4_total: this.state.Q4ST,
          year_used: this.props.budgetYearText,
          expense_cat: 1,
          cost_centre: this.props.costCenterId
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
            //this.setState({hasError:true, dialogBoxMsg: "Something went wrong, Please refresh the page. If this happens again, please contact your administrator"});
          }
      

    }

}
