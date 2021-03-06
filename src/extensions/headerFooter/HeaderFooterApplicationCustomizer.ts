import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import styles from './ApplicationCustomizer.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';

import * as strings from 'HeaderFooterApplicationCustomizerStrings';

const LOG_SOURCE: string = 'HeaderFooterApplicationCustomizer';
import Header, { IHeaderProps } from "./components/Header";
import Footer, { IFooterProps } from "./components/Footer";
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { SPComponentLoader } from '@microsoft/sp-loader';
require('jquery');
require('jquerySidebar');
require('navigation');
require('owlcarousel');
require('custom');

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IHeaderFooterApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
  Top: string;
  Bottom: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class HeaderFooterApplicationCustomizer
  extends BaseApplicationCustomizer<IHeaderFooterApplicationCustomizerProperties> {



  // These have been added
  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    // Wait for the placeholders to be created (or handle them being changed) and then render.
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    const siteUrl = this.context.pageContext.web.absoluteUrl;
    ////load all requried css in header and footer
    SPComponentLoader.loadCss(siteUrl+'/SiteAssets/css/main.css');
    SPComponentLoader.loadCss(siteUrl+'/SiteAssets/css/owl.carousel.min.cs');
    SPComponentLoader.loadCss(siteUrl+'/SiteAssets/css/all.min.css');
    SPComponentLoader.loadCss(siteUrl+'/SiteAssets/css/print.css');
    SPComponentLoader.loadCss(siteUrl+'/SiteAssets/css/fonts.css');
    return Promise.resolve();
  }

  private _renderPlaceHolders(): void {
    console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
    console.log(
      "Available placeholders: ",
      this.context.placeholderProvider.placeholderNames
        .map(name => PlaceholderName[name])
        .join(", ")
    );

    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }

      const elmt: React.ReactElement<IHeaderProps> = React.createElement(
        Header,
        {
          siteUrl: this.context.pageContext.web.absoluteUrl
        }
      );
      ReactDOM.render(elmt, this._topPlaceholder.domElement);
    }

    // Handling the bottom placeholder
    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._bottomPlaceholder) {
        console.error("The expected placeholder (Bottom) was not found.");
        return;
      }

      const footerElmt: React.ReactElement<IFooterProps> = React.createElement(Footer);
      ReactDOM.render(footerElmt, this._bottomPlaceholder.domElement);
    }
  }

  private _onDispose(): void {
    console.log('[HeaderFooterApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }
}
