
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
import { ContextualMenu } from 'office-ui-fabric-react/lib/ContextualMenu';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import {
  HttpClient,
} from '@microsoft/sp-http';

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
  hideDialog:boolean;
  isDraggable: boolean;
  hideMsgDialog: boolean;
  dialogBoxMsg: string;
  dialogMsg:string;
  hideFYDialog:boolean;
  hideMsgDialogSuccess:boolean;
  AllowedBudgetYear:string;
  IsAdmin:boolean;
}

export class RightButtonSection extends React.Component<IRightButtonSectionProps, IRightButtonSectionState> {
  private _dragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
  };
  
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
    this.state = {AllowedBudgetYear:'0',IsAdmin:false, hideMsgDialogSuccess:true,hideFYDialog:true,excelGenerated:false, excelMessage:"",budgetCategoryId:this.props.budgetCategoryId,costCenterId:this.props.costCenterId, 
    budgetYearId:this.props.budgetYearId,header:headers,excelData:[], NoteURL:notesURL, UserDocURL:UserDocURL,
    hideDialog:true,hideMsgDialog:true, isDraggable:true, dialogBoxMsg:"Something went Wrong, Please try again",dialogMsg:"Updating Database"
  };
  }

  public componentDidMount()
  {
    let notesURL = this.getNotesURL();
    let UserDocURL = this.getUserDocURL();
    this.IsAdmin();
    this.IsbudgetYear();
  }

  public render(): JSX.Element {
    if(this.state.budgetCategoryId !=this.props.budgetCategoryId || this.state.costCenterId!= this.props.costCenterId || 
      this.state.budgetYearId != this.props.budgetYearId)
    {
      this.setState({excelGenerated:false, budgetCategoryId: this.props.budgetCategoryId, costCenterId: this.props.costCenterId, budgetYearId: this.props.budgetYearId});
    }

    let fileName = this.props.budgetYearId + "_Budget_" +this.props.costCenterId + ".csv";
      return (
        <div>        
          <table style={{width:"100%"}}>
            <tr>
              <td align="right" style={{padding:3}}>
                <DefaultButton text="Notes"  allowDisabledFocus style={{width: "120px" }}  href={this.state.NoteURL} target="_blank" />
              </td>
              <td align="right" style={{padding:3}}>
                <DefaultButton text="User Doc" style={{width: "120px" }}  allowDisabledFocus href={this.state.UserDocURL} target="_blank" />
                
              </td>
              <td align="right" >
              <DefaultButton text="Excel" style={{width: "120px" }} allowDisabledFocus onClick={this.OnExcelClick.bind(this)} />
              
              </td>
            </tr>
            <tr>
                {this.getExcelHTML(fileName)}
            </tr>
                {this.getApprovalButtonHTML()}
          </table>
                  <Dialog hidden={this.state.hideDialog} onDismiss={this._closeDialog} 
                  dialogContentProps={{type: DialogType.normal,title: "Approve Cost Centre", closeButtonAriaLabel: 'Close', subText: "Are you sure you want to approve all in this Cost Centre",}} 
                 modalProps={{titleAriaId: "testingLabelID", subtitleAriaId: "testingLabelIDsub", isBlocking: false, styles: { main: { maxWidth: 450,backgroundColor:"#CCCCCC" } },
                 dragOptions: this.state.isDraggable ? this._dragOptions : undefined,}}>
         <DialogFooter>
         <DefaultButton onClick={this.BulkSaveCostCentre.bind(this)} text="Yes" />
         <DefaultButton onClick={this._closeDialog} text="No" />
         </DialogFooter>
         </Dialog>
         <Dialog hidden={this.state.hideFYDialog} onDismiss={this._closeDialog} 
                  dialogContentProps={{type: DialogType.normal,title: "Approve Budget Year", closeButtonAriaLabel: 'Close', subText: "Are you sure you want to approve all in this Budget Year",}} 
                 modalProps={{titleAriaId: "testingLabelID", subtitleAriaId: "testingLabelIDsub", isBlocking: false, styles: { main: { maxWidth: 450,backgroundColor:"#CCCCCC" } },
                 dragOptions: this.state.isDraggable ? this._dragOptions : undefined,}}>
         <DialogFooter>
         <DefaultButton onClick={this.BulkSaveFY.bind(this)} text="Yes" />
         <DefaultButton onClick={this._closeDialog} text="No" />
         </DialogFooter>
         </Dialog>
         <Dialog hidden={this.state.hideMsgDialog} onDismiss={this._closeDialog} 
                  dialogContentProps={{type: DialogType.normal,title: 'Data Updating', closeButtonAriaLabel: 'Close', subText: this.state.dialogBoxMsg,}} 
                 modalProps={{titleAriaId: "testingLabelID", subtitleAriaId: "testingLabelIDsub", isBlocking: false, styles: { main: { maxWidth: 450,backgroundColor:"#CCCCCC" } },
                 dragOptions: this.state.isDraggable ? this._dragOptions : undefined,}}>
          </Dialog>
          <Dialog hidden={this.state.hideMsgDialogSuccess} onDismiss={this._closeDialog} 
                  dialogContentProps={{type: DialogType.normal,title: 'Success', closeButtonAriaLabel: 'Close', subText: this.state.dialogBoxMsg,}} 
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
    this.setState({ hideDialog: true,hideMsgDialog:true, hideFYDialog:true,hideMsgDialogSuccess:true });
  }

  public bulkSaveDialogCS()
  {
    this.setState({hideDialog:false});
  }

  public BulkSaveCostCentre()
  {
    this.setState({hideDialog:true, hideMsgDialog:false, dialogBoxMsg:"Please wait while data is being updated. This window will close automatically" });
    let response1 : any = this.BulkSaveCostCentreWS().then(
      response => {
        response1 = response;
        this.setState({hideMsgDialog:true,hideMsgDialogSuccess:false, dialogBoxMsg:"Cost Center updated successfully."  });
        }); 
        //this.setState({Notes:i});
  }


  public async BulkSaveCostCentreWS(): Promise<any[]> {
    let WSS ="";
    WSS = Constants.apiURL + '/ApproveAllItemsInCostCenter?costCenter=' + this.state.costCenterId + '&FY=' + this.state.budgetYearId;
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

    public bulkSaveDialogFY()
    {
      this.setState({hideFYDialog:false});
    }
  
    public BulkSaveFY()
    {
      this.setState({hideFYDialog:true, hideMsgDialog:false, dialogBoxMsg:"Please wait while data is being updated. This window will close automatically" });
      let response1 : any = this.BulkSaveFYWS().then(
        response => {
          response1 = response;
          this.setState({hideMsgDialog:true,hideMsgDialogSuccess:false, dialogBoxMsg:"Budget Year updated successfully."  });
          }); 
          //this.setState({Notes:i});
    }
  
  
    public async BulkSaveFYWS(): Promise<any[]> {
      let WSS ="";
      WSS = Constants.apiURL + '/ApproveAllItemsInFY?FY=' + this.state.budgetYearId;
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
  



    public getExcelHTML(fileName)
    {
      if(this.state.excelGenerated == true)
      {
        return (
        <td align="right" colSpan={3} style={{padding:3}} >
        <CSVLink data={this.state.excelData} target="_Self" data-interception="off" filename={fileName} >
        Click here to Download
        </CSVLink></td>);
      }
      else
      {
        return (<td>
          &nbsp;
        </td>);
      }
    }


    public getApprovalButtonHTML()
    {
      let allowedBudgetyeardisable=true;
      if(this.state.budgetYearId == this.state.AllowedBudgetYear)
      {
        allowedBudgetyeardisable = false;
      }

      if(this.state.IsAdmin == true)
      {
        return (
            <tr>
              <td colSpan={2} align="right" style={{paddingTop:24}}>
                <DefaultButton text="Approve Cost Centre" disabled={allowedBudgetyeardisable} style={{width: "120px" }} allowDisabledFocus onClick={this.bulkSaveDialogCS.bind(this)} />
              </td>
              <td style={{paddingTop:24}} align="right" >
                <DefaultButton text="Approve Budget Year" style={{width: "120px" }} disabled={allowedBudgetyeardisable} allowDisabledFocus onClick={this.bulkSaveDialogFY.bind(this)} />
              </td>
              </tr>
              );
      }
      else
      {
        return (
        <tr>
        <td colSpan={2}>
          &nbsp;
        </td> </tr>);
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

    public IsbudgetYear()
    {
      
      let BClist:any =[];
      let i="0";
      let response1 : any = this.IsbudgetYearWS(this.props.budgetYearId).then(
        response => {
          response1 = response;
          
          this.setState({AllowedBudgetYear:response1});
        });
      
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

    public IsAdmin()
    {
      let i="0";
      let response1 : any = this.IsAdminWS(this.props.budgetYearId).then(
        response => {
          response1 = response;
          
          this.setState({IsAdmin:response1});
        });
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
  
}
