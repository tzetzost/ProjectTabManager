/*
Copyright 2015 Eiji Kitamura

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Author: Eiji Kitamura (agektmr@gmail.com)
*/

class Config {
  rootParentId: string = '2'
  rootName: string = 'Project Tab Manager'
  lazyLoad: boolean = false
  maxSessions: number = -1
  debug: boolean = true

  constructor() {
    let manifest = chrome.runtime.getManifest();
    if (manifest.key !== undefined) {
      // If there's key property exists in manifest, this is production
      this.debug = false;
    }
  }

  public init(): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(items => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          reject();
        } else {
          if (items.config) {
            this.rootParentId = items.config.rootParentId;
            this.rootName     = items.config.rootName;
            this.lazyLoad     = items.config.lazyLoad;
            this.maxSessions  = items.config.maxSessions;
          } else {
            this.sync();
          }
          if (this.debug) console.log('[Config] initialization finished', this);
          resolve();
        }
      });

      chrome.storage.onChanged.addListener((change, areaName) => {
        if (areaName == 'sync' && 'config' in change) {
          let config = change.config.newValue;
          this.rootParentId = config.rootParentId;
          this.rootName     = config.rootName;
          this.lazyLoad     = config.lazyLoad;
          this.maxSessions  = config.maxSessions;
          if (this.debug)
            console.log('[Config] configuration updated.', config);
        }
      });
    });
  }

  public sync() {
    chrome.storage.sync.set({config: {
      lazyLoad:     this.lazyLoad,
      rootParentId: this.rootParentId,
      rootName:     this.rootName,
      maxSessions:  this.maxSessions
    }}, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        console.log('sessions stored.',
          this.lazyLoad, this.rootParentId, this.rootName);
      }
    });
  }

  get archiveFolderName() {
    return '__Archive__';
  }

  get summaryRemains() {
    return 60 * 60 * 24 * 30 * 2 * 1000; // 2 month ago
  }
}

const config = new Config();

export default config;