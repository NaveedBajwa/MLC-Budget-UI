
import * as React from 'react';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { ITheme, mergeStyleSets, getTheme, getFocusStyle } from 'office-ui-fabric-react/lib/Styling';
//import { createListItems, IExampleItem } from '@uifabric/example-data';
import { DefaultButton, PrimaryButton, Stack, IStackTokens } from 'office-ui-fabric-react';
import NumberFormat from 'react-number-format';
import { CSVLink,CSVDownload } from "react-csv";
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Constants } from '../../components/Constants';
import {
  HttpClient,
} from '@microsoft/sp-http';

//import ReactExport from "react-data-export";

//const ExcelFile = ReactExport.ExcelFile;
//const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
//const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export interface IRightButtonSectionProps {
  budgetCategoryId:string; 
  costCenterId:string; 
  budgetYearId:string;
  budgetAppClient : AadHttpClient;
  context: WebPartContext;
}

export interface IRightButtonSectionState {
  excelGenerated:boolean;
  excelMessage:string;
  budgetCategoryId:string; 
  costCenterId:string; 
  budgetYearId:string;
  header:any[];
  excelData:any[];
  UserDocURL:string;
  NoteURL:string;
}

export class RightButtonSection extends React.Component<IRightButtonSectionProps, IRightButtonSectionState> {
  constructor(props: IRightButtonSectionProps) {
    super(props);
    let headers = [
      { label: "EXPENSE CATEGORY", key: "EXPENSECATEGORY" },
      { label: "COST CENTRE", key: "COSTCENTRE" },
      { label: "COST CENTRE DESC", key: "COSTCENTREDESC" },
      { label: "ACCOUNT NO", key: "ACCOUNTNO" },
      { label: "ITEM DESC", key: "ITEMDESC" },
      { label: "PRIORITY", key: "PRIORITY" },
      { label: "APP QUANTITY", key: "APPQUANTITY" },
      { label: "QUANTITY", key: "QUANTITY" },
      { label: "JAN", key: "JAN" },
      { label: "FEB", key: "FEB" },
      { label: "MAR", key: "MAR" },
      { label: "APR", key: "APR" },
      { label: "MAY", key: "MAY" },
      { label: "JUN", key: "JUN" },
      { label: "JUL", key: "JUL" },
      { label: "AUG", key: "AUG" },
      { label: "SEP", key: "SEP" },
      { label: "OCT", key: "OCT" },
      { label: "NOV", key: "NOV" },
      { label: "DEC", key: "DEC" },
      { label: "REQUESTED TOTAL", key: "REQUESTEDTOTAL" },
      { label: "APP JAN", key: "APPJAN" },
      { label: "APP FEB", key: "APPFEB" },
      { label: "APP MAR", key: "APPMAR" },
      { label: "APP APR", key: "APPAPR" },
      { label: "APP MAY", key: "APPMAY" },
      { label: "APP JUN", key: "APPJUN" },
      { label: "APP JUL", key: "APPJUL" },
      { label: "APP AUG", key: "APPAUG" },
      { label: "APP SEP", key: "APPSEP" },
      { label: "APP OCT", key: "APPOCT" },
      { label: "APP NOV", key: "APPNOV" },
      { label: "APP DEC", key: "APPDEC" },
      { label: "APPROVED TOTAL", key: "APPROVEDTOTAL" },
      { label: "APPROVED", key: "APPROVED" },
      { label: "REASON", key: "REASON" },
      { label: "YEAR_USED", key: "YEAR_USED" },
      { label: "ADDED_BY", key: "ADDED_BY" },
      { label: "ADDED_DATE", key: "ADDED_DATE" },
      { label: "APPROVED_BY", key: "APPROVED_BY" },
      { label: "APPROVED_DATE", key: "APPROVED_DATE" },
      { label: "MODIFIED_BY", key: "MODIFIED_BY" },
      { label: "MODIFIED_DATE", key: "MODIFIED_DATE" },
      { label: "COMMENTS", key: "COMMENTS" }
    ];
    let notesURL = this.getNotesURL();
    let UserDocURL = this.getUserDocURL();
    this.state = {excelGenerated:false, excelMessage:"",budgetCategoryId:this.props.budgetCategoryId,costCenterId:this.props.costCenterId, 
    budgetYearId:this.props.budgetYearId,header:headers,excelData:[], NoteURL:notesURL, UserDocURL:UserDocURL };
  }

  public componentDidMount()
  {
    let notesURL = this.getNotesURL();
    let UserDocURL = this.getUserDocURL();
    
  }

  public render(): JSX.Element {
    if(this.state.budgetCategoryId !=this.props.budgetCategoryId || this.state.costCenterId!= this.props.costCenterId || 
      this.state.budgetYearId != this.props.budgetYearId)
    {
      this.setState({excelGenerated:false, budgetCategoryId: this.props.budgetCategoryId, costCenterId: this.props.costCenterId, budgetYearId: this.props.budgetYearId});
    }

  
    
    if(this.state.excelGenerated == true)
    {
      return (
        
        <table style={{width:"100%"}}>
          <tr>
            <td align="right" style={{padding:3}}>
              <DefaultButton text="Notes" href={this.state.NoteURL}  allowDisabledFocus style={{width: "120px" }} />
            </td>
            <td align="right" style={{padding:3}}>
              <DefaultButton text="User Doc" style={{width: "120px" }} href={this.state.UserDocURL}  allowDisabledFocus />
              
            </td>
          </tr>
          <tr>
            <td align="right" colSpan={2}>
            <DefaultButton text="Excel" style={{width: "120px" }} allowDisabledFocus />
            <CSVLink  data={this.state.excelData} target="_Self" data-interception="off" >
                Click here to Download
            </CSVLink>

            </td>

          </tr>
        </table>
      
    );
    }
    else
    {
      return (
        
          <table style={{width:"100%"}}>
            <tr>
              <td align="right" style={{padding:3}}>
                <DefaultButton text="Notes"  allowDisabledFocus style={{width: "120px" }}  href={this.state.NoteURL} target="_blank" />
              </td>
              <td align="right" style={{padding:3}}>
                <DefaultButton text="User Doc" style={{width: "120px" }}  allowDisabledFocus href={this.state.UserDocURL} target="_blank" />
                
              </td>
            </tr>
            <tr>
              <td align="right" colSpan={2}>
              <DefaultButton text="Excel" style={{width: "120px" }} allowDisabledFocus onClick={this.OnExcelClick.bind(this)} />
              </td>
            </tr>
          </table>
        
      );
    }

    
  }

    public OnExcelClick()
    {
      this.getBudgetCategoryOptions();
      //this.setState({excelGenerated:true});
    }


    public getBudgetCategoryOptions(): any[]
    {
      let BClist:any =[];
      let ComOptions:any[] = [];
      let i="0";
      
      let response1 : any = this.GetBudgetcategoriesWS().then(
        response => {
          response1 = response;
          response.map(itemY=>{
            let requestedtotal = 0;
           ComOptions =  ComOptions.concat(
            { "EXPENSE CATEGORY": itemY.EXPENSE_CATEGORY_NAME, 
              "COST CENTRE": itemY.COST_CENTRE_DESC,
              "ACCOUNT NO": itemY.ACCOUNT_NO, 
              "ITEM DESC": itemY.ITEM_DESC, 
              "PRIORITY": itemY.PRIORITY,
              "APP QUANTITY": itemY.APP_QUANTITY, 
              QUANTITY: itemY.QUANTITY, 
              JAN: itemY.JAN_TOT,
              FEB: itemY.FEB_TOT, 
              MAR: itemY.MAR_TOT, 
              APR: itemY.APR_TOT,
              MAY: itemY.MAY_TOT, 
              JUN: itemY.JUN_TOT, 
              JUL: itemY.JUL_TOT,
              AUG: itemY.AUG_TOT, 
              SEP: itemY.SEP_TOT, 
              OCT: itemY.OCT_TOT,
              NOV: itemY.NOV_TOT, 
              DEC: itemY.DEC_TOT, 
              "REQUESTED TOTAL": itemY.REQUESTEDTOTAL,
              APPJAN: itemY.APP_JAN_TOT,
              APPFEB: itemY.APP_FEB_TOT, 
              APPMAR: itemY.APP_MAR_TOT, 
              APPAPR: itemY.APP_APR_TOT, 
              APPMAY: itemY.APP_MAY_TOT, 
              APPJUN: itemY.APP_JUN_TOT, 
              APPJUL: itemY.APP_JUL_TOT,
              APPAUG: itemY.APP_AUG_TOT, 
              APPSEP: itemY.APP_SEP_TOT, 
              APPOCT: itemY.APP_OCT_TOT,
              APPNOV: itemY.APP_NOV_TOT, 
              APPDEC: itemY.APP_DEC_TOT, 
              "APPROVED TOTAL": itemY.APPROVED_TOTAL, 
              APPROVED: itemY.APPROVED, 
              REASON: itemY.REASON,
              "YEAR USED": itemY.YEAR_USED, 
              "ADDED BY": itemY.ADDED_BY, 
              "ADDED DATE": itemY.ADDED_DATE,
              "APPROVED BY": itemY.APPROVED_BY, 
              "APPROVED DATE": itemY.APPROVED_DATE, 
              "MODIFIED BY": itemY.MODIFIED_BY,
              "MODIFIED DATE": itemY.MODIFIED_DATE, 
              COMMENTS: itemY.COMMENTS
             });
          }); 
          this.setState({excelGenerated:true, excelData: ComOptions});
          
        }
      );
      return ComOptions;
    }
  
  
    public async GetBudgetcategoriesWS(): Promise<any[]> {
      let WSS ="";
      WSS = Constants.apiURL + '/GetItemsByBudgetCategory_CostCentre_FY?budgetCategory=' + this.props.budgetCategoryId + '&costCenter='+ 
          this.props.costCenterId +'&FY=' + this.props.budgetYearId;
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


      public getNotesURL(): string
      {

        let i="0";
        
        let response1 : any = this.GetNotesWS().then(
          response => {
            response1 = response;
            i = response.toString();
            this.setState({NoteURL:i});
            }); 
            //this.setState({Notes:i});
        return i;
      }
    
    
      public async GetNotesWS(): Promise<any[]> {
        let WSS ="";
        WSS = Constants.apiURL + '/GetNoteslink';
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


        public getUserDocURL(): string
        {
  
          let i="0";
          
          let response1 : any = this.getUserDocURLWS().then(
            response => {
              response1 = response;
              i = response.toString();
              this.setState({ UserDocURL:i});
              }); 
              //this.setState({Notes:i});
          return i;
        }
      
      
        public async getUserDocURLWS(): Promise<any[]> {
          let WSS ="";
          WSS = Constants.apiURL + '/GetUserDoclink';
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
