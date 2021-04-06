
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
import { AadHttpClient} from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Constants } from '../../components/Constants';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';



export interface IExpenseTableBMProps {
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

export interface IExpenseTableBMState {
  trColor:string;
  items:any[];
  itemsTotal:any[];
  itemsStudentTotal:any[];
  costCenterId:string;
  budgetYearId:string;
  BudgetYearText:string;
  hideDialog:boolean;
  isDraggable: boolean;
  hideMsgDialog: boolean;
  dialogBoxMsg: string;
}

export class IComboBoxOptionLoan implements IComboBoxOption
    {
      public key: string;
      public text : string;
    }


export class ExpenseTableBM extends React.Component<IExpenseTableBMProps, IExpenseTableBMState> {
  
  constructor(props: IExpenseTableBMProps) {
    super(props);
    this.state = {hideDialog:true,hideMsgDialog:true, isDraggable:true, dialogBoxMsg:"Something went Wrong, Please try again" ,trColor:"white",items:[],itemsTotal:[],itemsStudentTotal:[], costCenterId:this.props.costCenterId,budgetYearId:this.props.budgetYearId,BudgetYearText:this.props.budgetCategoryText};
  }

  private _dragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
  };

  public componentDidMount() {
    this.setItems();
    this.setItemsTotal();
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
                        </tr>
      );
    }
    return this.state.items.map((item, index) => {
        return (
        <tr style={{cursor:"pointer"}} onPointerLeave={this.resetColor.bind(this)} onPointerEnter={this.changeColor.bind(this)} >
        <td key={index} title={item.itemID} data-item={item.itemID} onClick={this.OnRowClick.bind(this)}  style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" }}>
          {item.item}
        </td>
        <td key={index} title={item.itemID} data-item={item.account} onClick={this.OnRowClick.bind(this)}  style={{border:"1px", borderColor:"black",borderCollapse:"collapse" , borderStyle:"solid" }} align="right">
        <NumberFormat value={Number(item.term1).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </td>
        <td key={index} title={item.itemID} data-item={item.account} onClick={this.OnRowClick.bind(this)}  style={{border:"1px", borderColor:"black",borderCollapse:"collapse" , borderStyle:"solid" }} align="right">
        <NumberFormat value={Number(item.term2).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </td>
        <td key={index} title={item.itemID} data-item={item.account} onClick={this.OnRowClick.bind(this)}  style={{border:"1px", borderColor:"black",borderCollapse:"collapse" , borderStyle:"solid" }} align="right">
        <NumberFormat value={Number(item.term3).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          
        </td>
        <td key={index} title={item.itemID} data-item={item.account} onClick={this.OnRowClick.bind(this)}  style={{border:"1px", borderColor:"black",borderCollapse:"collapse" , borderStyle:"solid" }} align="right">
        <NumberFormat value={Number(item.term4).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          
        </td>
        <td key={index} title={item.itemID} data-item={item.account} onClick={this.OnRowClick.bind(this)}  style={{border:"1px", borderColor:"black",borderCollapse:"collapse" , borderStyle:"solid" }} align="right">
        <NumberFormat value={Number(item.total).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
        </td>
        <td key={index} title={item.itemID} data-item={item.account} onClick={this.OnRowClick.bind(this)}  style={{border:"1px", borderColor:"black",borderCollapse:"collapse" , borderStyle:"solid" }} align="right">
        <NumberFormat value={Number(item.approvedTotal).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
          
        </td>

      </tr>  
    );
      }
    );
  }

  public renderTotalData() {
    
    return this.state.itemsTotal.map((item, index) => {
        return (
        <tr >
        <td align="right">
          <b>Total</b>
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
      </tr>  );
      }
    );
  }

 public render(): JSX.Element {
    if(this.props.costCenterId != this.state.costCenterId && this.props.costCenterId != "abc")
    {
      this.setState({costCenterId:this.props.costCenterId,hideDialog: false, dialogBoxMsg: "Please wait while the data is being loaded. This message will close automatically."});
      this.setItems();
      this.setItemsTotal();
    }
    if(this.props.budgetYearText != this.state.BudgetYearText && this.props.costCenterId != "abc")
    {
      this.setState({budgetYearId:this.props.budgetYearId, BudgetYearText:this.props.budgetYearText , hideDialog: false, dialogBoxMsg: "Please wait while the data is being loaded. This message will close automatically. " });
      this.setItems();
      this.setItemsTotal();
    }
    return (
      <div>
              <table style={{width:"100%", borderStyle:"solid", border:"1px", borderColor:"black",borderCollapse:"collapse" }} >

                <tr  style={{border:1, backgroundColor:"#D3D3D3",paddingTop:3}} >
                  <td style={{width:"40%", border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid"  }}>
                    <b>ITEM</b>
                  </td>
                  <td align="right" style={{width:"10%", border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid" }} > 
                    <b>TERM 1 </b>
                  </td>
                  <td align="right" style={{width:"10%", border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid"  }}>
                  <b>TERM 2 </b>
                  </td>
                  <td align="right" style={{width:"10%", border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid"  }}>
                  <b>TERM 3 </b>
                  </td>
                  <td align="right" style={{width:"10%", border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid"  }}>
                  <b>TERM 4 </b>
                  </td>
                  <td align="right" style={{width:"10%", border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid"  }}>
                    <b>TOTAL </b>
                  </td>
                  <td align="right" style={{width:"10%", border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid"  }}>
                    <b>APPR TOTAL </b>
                  </td>
                </tr>

                {
                  this.renderTableData()
                }
                <tr>
                    <td colSpan={7}>&nbsp;</td>
                </tr>
                  {
                    this.renderTotalData()
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
                                        dialogContentProps={{type: DialogType.normal,title: 'System Message', closeButtonAriaLabel: 'Close', subText: this.state.dialogBoxMsg,}} 
                                       modalProps={{titleAriaId: "testingLabelID", subtitleAriaId: "testingLabelIDsub", isBlocking: false, styles: { main: { maxWidth: 450 } },
                                       dragOptions: this.state.isDraggable ? this._dragOptions : undefined,}}>
                               </Dialog>
                               </div>
              
      );
  }


  private _showDialog = (): void => {
    this.setState({ hideDialog: false });
  }

  private _closeDialog = (): void => {
    this.setState({ hideDialog: true });
  }
  public setItems()
  {
    let response1 : any = this.SetItemsWS().then(
      response => {
        response1 = response;
        this.setState({items: response, hideDialog: true});
      }
    );
  }

  public async SetItemsWS(): Promise<any[]> {
    //let WSS = Constants.apiURL + '/GetExpenseTableByBudgetCategory_CostCentre_FY?budgetCategory=' + this.props.budgetCategoryId + '&costCenter=103&FY=2021';
    if(this.props.costCenterId == "abc")
    {
      return [];
    }
    let WSS = Constants.apiURL + '/GetBMExpenseTableByBudgetCategory_CostCentre_FY?budgetCategory=' + this.props.budgetCategoryId + '&costCenter='+ 
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
  ///const accountCode = e.target.getAttribute('data-item');
  const accountCode = e.currentTarget.title;
  const itemCode = e.currentTarget.title;
  this.props.OnChangeExpenseInputView(true,'',itemCode);


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
  let WSS = Constants.apiURL + '/GetBMExpenseTableByBudgetCategory_CostCentre_FY_Total?budgetCategory=' + this.props.budgetCategoryId + '&costCenter='+ 
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
}