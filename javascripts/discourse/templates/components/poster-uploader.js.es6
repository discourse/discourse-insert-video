import { alias } from "@ember/object/computed";
import { default as discourseComputed } from "discourse-common/utils/decorators";
import Component from "@ember/component";
import UploadMixin from "discourse/mixins/upload";

export default Component.extend(UploadMixin, {
  type: "image",
  addDisabled: alias("uploading"),
  classNameBindings: [":poster-uploader"],
  uploadDone({ url }) {
    this.set("poster", url);
    this.setPoster(url);
  },
  actions: {
    updatePoster(poster) {
      this.setPoster(poster);
    }
  }
});
