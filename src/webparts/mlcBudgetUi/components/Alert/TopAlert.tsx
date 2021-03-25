
import * as React from 'react';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { ITheme, mergeStyleSets, getTheme, getFocusStyle } from 'office-ui-fabric-react/lib/Styling';
import { DefaultButton, PrimaryButton, Stack, IStackTokens } from 'office-ui-fabric-react';
import NumberFormat from 'react-number-format';

export interface ITopAlertProps {
  alertText: string;
  boldText:string;
}


export interface ITopAlertState {
  items: any[];
}

export class TopAlert extends React.Component<ITopAlertProps, ITopAlertState> {
  private _items: any[];
  constructor(props: ITopAlertProps) {
    super(props);
    
  }

  public render(): JSX.Element {
    //if (this.props.alertText)
    return (
          <table style={{backgroundColor:"#f3565d",color:"white", width:"100%" }}>
            <tr style={{backgroundColor:"#f3565d",color:"white", width:"100%" }}>
              <td style={{backgroundColor:"#f3565d",color:"white", width:"100%",padding:"10px" }}>
                {this.props.alertText} &nbsp; 
                <b>
                {this.props.boldText}
                </b>
              </td>
            </tr>
            
          </table>
          
        
      );
  }
}
