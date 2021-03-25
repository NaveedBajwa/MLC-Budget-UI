
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
import { CSVLink } from "react-csv";


export interface IEFHeaderProps {
  YearText:string;
  CostCenterText:string;
}

export interface IEFHeaderState {
}

export class EFHeader extends React.Component<IEFHeaderProps, IEFHeaderState> {
  
  constructor(props: IEFHeaderProps) {
    super(props);
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
            <DefaultButton text="Notes" style={{width: "120px" }}></DefaultButton>
          </td >
          <td style={{width:"15%"}}>
            <DefaultButton text="User Doc" style={{width: "120px" }}></DefaultButton>
          </td>
          </tr>
        </table>
      );

    }
}
