import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMlcBudgetingAppProps {
  description: string;
  budgetAppClient : AadHttpClient;
  context: WebPartContext;
}
