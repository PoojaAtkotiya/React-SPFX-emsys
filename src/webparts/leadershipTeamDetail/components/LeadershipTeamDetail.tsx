import * as React from 'react';
//import styles from './LeadershipTeamDetail.module.scss';
import { ILeadershipTeamDetailProps, ILeadershipTeamDetailState } from './ILeadershipTeamDetailProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Common from '../../common';

const commonObj: Common = new Common();
const defaultImgUrl = "/SiteAssets/Images/default.jpg";
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('itemId');
export default class LeadershipTeamDetail extends React.Component<ILeadershipTeamDetailProps, ILeadershipTeamDetailState> {

  constructor(props: ILeadershipTeamDetailProps, state: ILeadershipTeamDetailState) {
    super(props);
    this.state = {
      leaderItem: []
    };
  }

  public componentDidMount() {
    this.GetItemsForLeader();
  }

  private GetItemsForLeader() {
    var listName = "LeadersTeam";// this.props.listName;
    var query = "?$select=*,LeaderName/Title,LeaderName/EMail&$expand=LeaderName&$filter=ID eq " + itemId;
    var method = 'get items for LeadersTeam';
    commonObj.getDataFromList(this.props.siteUrl, listName, query, method).then(res => {
      if (res.data.value != undefined && res.data.value != null) {
        var dataFiltered = res.data.value;
        this.setState({ leaderItem: dataFiltered });
      }
    }).catch(error => {
      console.log('error while getting data');
      console.log(error);
    });
  }


  public render(): React.ReactElement<ILeadershipTeamDetailProps> {
    return (
      <div>
        {this.renderLeaderDetails()}
      </div>

    );
  }

  private renderLeaderDetails() {
    
    return this.state.leaderItem.map(item => {
      var leaderImg = item.LeaderImage && item.LeaderImage.Url ? item.LeaderImage.Url : this.props.siteUrl + defaultImgUrl;
      return (
        <div className="inner extra">
          <div className="page-title leader-page-title">
            <h2><strong>{item.LeaderName && item.LeaderName.Title ? item.LeaderName.Title : ""}</strong></h2>
          </div>
          <div className="two-col leader-details-sec leader-details-new-sec">
            <div className="two-col-item two-col-img">
              <img className="leaderImg" src={leaderImg} title="" alt="" data-description="" />
              <strong>{item.LeaderName && item.LeaderName.Title ? item.LeaderName.Title : ""}</strong>
              <em>{item.Title ? item.Title : ""}</em>
            </div>
            <div className="two-col-item two-col-cont pl-5">
              <p>{item.About ? item.About : ""}</p>
              <a href={this.props.siteUrl + '/SitePages/Leadershipteam.aspx'} className="go-back button">Go back</a>
            </div>
          </div>
        </div>
      );
    });
  }
}
