
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
import { CSVLink } from "react-csv";
import { Constants } from '../../Constants';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";


export interface IEFHeaderProps {
  YearText:string;
  CostCenterText:string;
  budgetAppClient : AadHttpClient;
  context: WebPartContext;
}

export interface IEFHeaderState {
  UserDocURL:string;
  NoteURL:string;
}

export class EFHeader extends React.Component<IEFHeaderProps, IEFHeaderState> {
  
  constructor(props: IEFHeaderProps) {
    super(props);
    this.state = {UserDocURL:"", NoteURL:""};
}

public componentDidMount()
{
  let notesURL = this.getNotesURL();
  let UserDocURL = this.getUserDocURL();
  
}

  public render(): JSX.Element {
    return(
          <table style={{width:"100%"}}>
          <tr>
          <td style={{width:"75%"}}>
            <h1>
              {this.props.YearText} Finance Budget Submission Shown:  {this.props.CostCenterText}   
            </h1>
          </td>
          <td style={{width:"10%"}} >
             <DefaultButton text="Notes" href={this.state.NoteURL}  allowDisabledFocus style={{width: "120px" }} />
          </td >
          <td style={{width:"15%"}}>
              <DefaultButton text="User Doc" style={{width: "120px" }} href={this.state.UserDocURL}  allowDisabledFocus />
          </td>
          </tr>
        </table>
      );

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
