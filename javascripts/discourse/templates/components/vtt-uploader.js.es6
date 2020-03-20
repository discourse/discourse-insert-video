import { alias } from "@ember/object/computed";
import Component from "@ember/component";
import UploadMixin from "discourse/mixins/upload";
import { lookupUncachedUploadUrls } from "pretty-text/upload-short-url";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default Component.extend(UploadMixin, {
  type: "vtt",
  addDisabled: alias("uploading"),
  classNameBindings: [":simple-list-uploader"],

  uploadDone(upload) {
    lookupUncachedUploadUrls([upload.short_url], ajax).then(res => {
      if (res[0].short_path) {
        this.refresh(res[0].short_path);
      } else {
        popupAjaxError({
          responseJSON: {
            error: "ERROR: Could not generate short_path for this upload"
          }
        });
      }
    });
  }
});
