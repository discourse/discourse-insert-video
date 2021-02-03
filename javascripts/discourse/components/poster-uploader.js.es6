import { action } from "@ember/object";
import { alias } from "@ember/object/computed";
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

  @action
  updatePoster(poster) {
    this.setPoster(poster);
  }
});
