/*
Copyright 2012 Eiji Kitamura

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
var Config = (function() {
  var rootParentId_ = '2',
      rootName_     = 'Project Tab Manager',
      lazyLoad_     = true;

  var setConfig = function() {
    chrome.storage.sync.set({config: {
      lazyLoad:     lazyLoad_,
      rootParentId: rootParentId_,
      rootName:     rootName_
    }}, function() {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        console.log('sessions stored.', lazyLoad_, rootParentId_, rootName_);
      }
    })
  };

  var Config = function(callback) {
    chrome.storage.sync.get((function(items) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        var conf = items['config'] || {};
        rootParentId_ = conf.rootParentId || localStorage.rootParentId || '2';
        rootName_     = conf.rootName     || localStorage.rootName     || 'Project Tab Manager';
        if (conf.lazyLoad !== undefined) {
          lazyLoad_ = conf.lazyLoad_;
        } else {
          lazyLoad_ = localStorage.lazyLoad === 'true' ? true : false;
        }
       if (this.debug) console.log('[Config] initialization finished');
        if (typeof callback === 'function') callback();
      }
    }).bind(this));
  };
  Config.prototype = {
    debug: true,
    archiveFolderName: '__Archive__',
    hiddenFolderName: 'passive',
    set lazyLoad(val) {
      lazyLoad_ = val ? true : false;
      setConfig();
    },
    get lazyLoad() {
      return lazyLoad_;
    },
    set rootParentId(val) {
      rootParentId_ = val;
      setConfig();
    },
    get rootParentId() {
      return rootParentId_;
    },
    set rootName(val) {
      rootName_ = val;
      setConfig();
    },
    get rootName() {
      return rootName_;
    }
  };
  return Config;
})();
