import { alias } from "@ember/object/computed";
import { default as discourseComputed } from "discourse-common/utils/decorators";
import Component from "@ember/component";
import UploadMixin from "discourse/mixins/upload";
import { lookupUncachedUploadUrls } from "pretty-text/upload-short-url";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default Component.extend(UploadMixin, {
  type: "image",
  addDisabled: alias("uploading"),
  classNameBindings: [":poster-uploader"],
  uploadDone(upload) {
    lookupUncachedUploadUrls([upload.short_url], ajax).then(res => {
      if (res[0].short_path) {
        this.set("poster", res[0].short_path);
        this.setPoster(res[0].short_path);
      } else {
        popupAjaxError({
          responseJSON: {
            error: "ERROR: Could not generate short_path for this upload"
          }
        });
      }
    });
  },
  actions: {
    updatePoster(poster) {
      this.setPoster(poster);
    }
  }
});
