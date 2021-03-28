
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
  itemCategoryId:string;
  budgetYearId:string;
  budgetCategoryId:string;

}

export interface IEFItemInputState {
  
}

export class EFItemInput extends React.Component<IEFItemInputProps, IEFItemInputState> {


  constructor(props: IEFItemInputProps) {
    super(props);
  }


  public render(): JSX.Element {
    if(this.props.budgetCategoryId == "1")
    {
    return(
      <div>
            <EFItemInputOE  OnChangeItemId={this.props.OnChangeItemId.bind(this)} itemId={this.props.itemId}  budgetAppClient={this.props.budgetAppClient} context={this.props.context} 
              costCenterId={this.props.costCenterId} AccountNumberId={this.props.itemCategoryId} YearId={this.props.budgetYearId} 
              refreshThis={this.props.refreshThis.bind(this)} />
      </div>
    
    );
    }
    else if(this.props.budgetCategoryId == "1")
    {
    return(
      <div>
          Input box 2
      </div>
    
    );
    }
  }



}
