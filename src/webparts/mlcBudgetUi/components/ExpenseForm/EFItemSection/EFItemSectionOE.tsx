
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
import { getItemStyles } from 'office-ui-fabric-react/lib/components/ContextualMenu/ContextualMenu.classNames';


export interface IEFItemSectionOEProps {
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
  ItemId:string;
}

export interface IEFItemSectionOEState {
  budgetCategoryText:string;
  budgetCategoryId:string;
  costCenterText:string;
  costCenterId:string;
  itemCategoryId:string;
  BudgetCategoryOptions:IComboBoxOptionLoan[];
  CostCenterOptions:IComboBoxOptionLoan[];
  ItemCategoryOption:IComboBoxOptionLoan[];
  items:any[];
  refresh:number;
  itemID:string;
}

export class IComboBoxOptionLoan implements IComboBoxOption
    {
      public key: string;
      public text : string;
    }


export class EFItemSectionOE extends React.Component<IEFItemSectionOEProps, IEFItemSectionOEState> {
  
  public requestTotal:number;
  public approvedTotal:number;

  constructor(props: IEFItemSectionOEProps) {
    super(props);

    //this.getItemCategoryOptions.bind(this);
    //let CostCenterOption:IComboBoxOptionLoan[] = this.getCostCenterOptions();

    this.state = { itemID:"0", refresh:0, items:[],ItemCategoryOption:[], budgetCategoryText:this.props.budgetCategoryText, budgetCategoryId:this.props.budgetCategoryId,  costCenterText:this.props.costCenterText,
      costCenterId:this.props.costCenterId, BudgetCategoryOptions:this.props.BudgetCategoryOptions, CostCenterOptions:this.props.CostCenterOptions, itemCategoryId:this.props.itemCategoryId
    };
  }

  public componentDidMount()
  {
    this.getItemCategoryOptions();
    this.setItems(this.state.itemCategoryId);
  }

  public render(): JSX.Element {
    if(this.props.refresh != this.state.refresh )
    {
      //this.getItemCategoryOptions();
      this.setItems(this.state.itemCategoryId);
    }
    if(this.state.budgetCategoryId != this.props.budgetCategoryId || this.state.costCenterId != this.props.costCenterId)
    {
      this.setItems(this.props.itemCategoryId);
    }
    return(
          <table style={{width:"100%"}} >
          <tr style={{width:"100%"}}>
          <td style={{width:"100%"}}>
              <table style={{width:"100%"}}>
                <tr style={{width:"100%"}}>
                  <td style={{width:"100%"}}>
                    <b>Budget Category</b>
                  </td>
                </tr>
                <tr>
                  <td>
                    <ComboBox
                    label=""
                    key={'BudgetCategory'}
                    autoComplete={true ? 'on' : 'off'}
                    options={this.props.BudgetCategoryOptions}
                    selectedKey={this.state.budgetCategoryId}
                    onChange={this.OnBudgetCategoryChange.bind(this)}
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
                  Item Category:
                  </b>
                </td>
              </tr>
              <tr>
                <td>
                 <ComboBox
                    label=""
                    key={'ItemCategory'}
                    autoComplete={true ? 'on' : 'off'}
                    options={this.state.ItemCategoryOption}
                    selectedKey={this.props.itemCategoryId}
                    onChange={this.OnItemCategoryChange.bind(this)}
                  />
                </td>
              </tr>
            </table>
            </td> 
          </tr>
          <tr  style={{width:"100%"}}>
            <td  style={{width:"100%"}}>
              <table className={styles.table} style={{width:"100%",border:1, borderStyle:"solid", borderColor:"black" }}>
                <tr style={{backgroundColor:"#e5e5e5", width:"100%"}}   >
                  <td style={{border:1, borderStyle:"solid", borderColor:"black" }}>
                    <b>Item Description</b>
                  </td>
                  <td border-collapse="collapse" style={{border:1, borderStyle:"solid", borderColor:"black" }}>
                    <b>Requested</b>
                  </td>
                  <td border-collapse="collapse" style={{border:1, borderStyle:"solid", borderColor:"black" }}>
                    <b>Approved</b>
                  </td>
                  <td border-collapse="collapse" style={{border:1, borderStyle:"solid", borderColor:"black" }}>
                    <b>Priority</b>
                  </td>
                </tr>
                {this.renderTableData()}
                {this.renderTotalData()}
              </table>
            </td>
          </tr>
        </table>
      );
    }

    public OnBudgetCategoryChange(evt,Cmb_Selected)
    {
      
        this.props.OnBudgetCategoryChange(Cmb_Selected.key);
        //this.innerItemCategoryChange(Cmb_Selected.key);
        
        //this.setItems(Cmb_Selected.key);
    }

    public OnItemCategoryChange(evt,Cmb_Selected)
    {
        //this.props.OnBudgetCategoryChange(Cmb_Selected.key);
        //this.innerItemCategoryChange(Cmb_Selected.key);
        
        this.setItems(Cmb_Selected.key);
        this.props.OnChangeitemCategoryId(Cmb_Selected.key);
        //this.props.OnChangeItemId('0');
    }

  public getItemCategoryOptions(): IComboBoxOptionLoan[]
  {
    let BClist:any =[];
    let ComOptions:IComboBoxOptionLoan[] = [];
    let i=this.props.itemCategoryId;
    let response1 : any = this.GetItemCategoriesWS().then(
      response => {
        response1 = response;
        response.map(itemY=>{

          let comOption = new IComboBoxOptionLoan();
          comOption.key = itemY.ItemCategoryId; 
          comOption.text = itemY.ItemCategoryText;
          ComOptions = ComOptions.concat(comOption);
        }); 
        let check = "0";
        this.setState({itemCategoryId:i, ItemCategoryOption: ComOptions});
        
      }
    );
    return ComOptions;
  }


  public async GetItemCategoriesWS(): Promise<any[]> {
    let WSS = Constants.apiURL + '/GetDistinctOEItemCategoryByBudgetCategory_CostCentre_FY2?budgetCategory=' + this.props.budgetCategoryId + '&costCenter='+ 
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

    public setItems(ItemCategoryKey)
  {
    let response1 : any = this.SetItemsWS(ItemCategoryKey).then(
      response => {
        response1 = response;
        this.setState({items: response,itemCategoryId:ItemCategoryKey,refresh:this.props.refresh});
      }
    );
  }

  public async SetItemsWS(ItemCategoryKey): Promise<any[]> {
    //let WSS = Constants.apiURL + '/GetExpenseTableByBudgetCategory_CostCentre_FY?budgetCategory=' + this.props.budgetCategoryId + '&costCenter=103&FY=2021';
    if(this.props.costCenterId == "abc")
    {
      return [];
    }
    let WSS = Constants.apiURL + '/GetOEItemsByBudgetCategory_CostCentre_FY_ItemCategory?budgetCategory=' + this.state.budgetCategoryId + '&costCenter='+ 
        this.props.costCenterId +'&FY=' + this.props.budgetYearText + '&ItemCategory=' + ItemCategoryKey;
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

    public renderTableData() {
      this.requestTotal = 0;
      this.approvedTotal = 0;
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
                          </tr>
        );
      }

      return this.state.items.map((item, index) => 
        {
            this.requestTotal += (item.JAN_TOT + item.FEB_TOT + item.MAR_TOT +item.APR_TOT + item.MAY_TOT + item.JUN_TOT +item.JUL_TOT + item.AUG_TOT + item.SEP_TOT +item.OCT_TOT + item.NOV_TOT + item.DEC_TOT);
            this.approvedTotal += item.APP_JAN_TOT + item.APP_FEB_TOT + item.APP_MAR_TOT +item.APP_APR_TOT + item.APP_MAY_TOT + item.APP_JUN_TOT +item.APP_JUL_TOT + item.APP_AUG_TOT + item.APP_SEP_TOT +item.APP_OCT_TOT + item.APP_NOV_TOT + item.APP_DEC_TOT;
            return (
            <tr key={index} data-item={item.ITEM_ID} style={{cursor:"pointer", backgroundColor: item.ITEM_ID == this.props.ItemId ? "#ffcccc" : 'white' }} onPointerLeave={this.resetColor.bind(this)} onPointerEnter={this.changeColor.bind(this) } >
            <td key={index} data-item={item.ITEM_ID} title={item.ITEM_ID} onClick={this.OnRowClick.bind(this)} style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid"}}>
              {item.ITEM_DESC}
            </td>
            <td  key={index} data-item={item.ITEM_ID} title={item.ITEM_ID} onClick={this.OnRowClick.bind(this)} style={{ border:"1px", borderColor:"black",borderCollapse:"collapse", borderStyle:"solid"}} align="right">
              <NumberFormat value={Number(item.JAN_TOT + item.FEB_TOT + item.MAR_TOT +item.APR_TOT + item.MAY_TOT + item.JUN_TOT +item.JUL_TOT + item.AUG_TOT + item.SEP_TOT +item.OCT_TOT + item.NOV_TOT + item.DEC_TOT).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
            </td>
            <td key={index} data-item={item.ITEM_ID} title={item.ITEM_ID} onClick={this.OnRowClick.bind(this)} style={{border:"1px", borderColor:"black",borderCollapse:"collapse" , borderStyle:"solid" }} align="right">
             <NumberFormat value={Number(item.APP_JAN_TOT + item.APP_FEB_TOT + item.APP_MAR_TOT +item.APP_APR_TOT + item.APP_MAY_TOT + item.APP_JUN_TOT +item.APP_JUL_TOT + item.APP_AUG_TOT + item.APP_SEP_TOT +item.APP_OCT_TOT + item.APP_NOV_TOT + item.APP_DEC_TOT).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
            </td>
            <td key={index} data-item={item.ITEM_ID} title={item.ITEM_ID} onClick={this.OnRowClick.bind(this)} style={{border:"1px", borderColor:"black",borderCollapse:"collapse" , borderStyle:"solid" }} align="right">
              {item.PRIORITY}
            </td>
          </tr>  );
          }
      );
    }

    public renderTotalData()
    {
      return (
            <tr >
            <td >
              <b>
                TOTAL:
              </b>
            </td>
            <td align="right"  >
              <b> 
              <NumberFormat value={Number(this.requestTotal).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
              </b>
            </td>
            <td align="right">
              <b>
              <NumberFormat value={Number(this.approvedTotal).toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> 
              </b>
            </td>
            <td align="right">
              &nbsp;
            </td>
          </tr>  
          );
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
  //const itemId = e.currentTarget.getAttribute('data-item');
  const itemId = e.currentTarget.title;
  this.setState({itemID:itemId});
  this.props.OnChangeItemId(itemId);

}

}
