import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import MlcBudgetingApp, { IMlcBudgetingAppState }  from './components/MlcBudgetingApp';
import { IMlcBudgetingAppProps } from './components/IMlcBudgetingAppProps';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { Constants } from './components/Constants';

export interface IMlcBudgetingAppWebPartProps {
  description: string;
}

import * as strings from 'MlcBudgetUiWebPartStrings';

export default class MlcBudgetUiWebPart extends BaseClientSideWebPart<IMlcBudgetingAppWebPartProps> {

  private budgetAppClient: AadHttpClient;
  protected onInit(): Promise<void> {
    initializeIcons();
    return new Promise<void>((resolve: () => void, reject: (error: any) => void): void => {
      this.context.aadHttpClientFactory
        .getClient(Constants.apiClientId) 
        .then((client: AadHttpClient): void => {
          this.budgetAppClient = client;
          resolve();
        }, err => reject(err));
    });
  }

  public render(): void {
    
    const element: React.ReactElement<IMlcBudgetingAppProps> = React.createElement(
      MlcBudgetingApp,
      {
        description: this.properties.description,
        budgetAppClient : this.budgetAppClient,
        context : this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}