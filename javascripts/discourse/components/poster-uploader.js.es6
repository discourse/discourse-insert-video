import { action } from "@ember/object";
import { alias } from "@ember/object/computed";
import Component from "@ember/component";
import UppyUploadMixin from "discourse/mixins/uppy-upload";

export default Component.extend(UppyUploadMixin, {
  type: "image",
  addDisabled: alias("uploading"),
  classNameBindings: [":poster-uploader"],
  uploadDone({ url }) {
    this.set("poster", url);
    this.setPoster(url);
  },

  @action
  updatePoster() {
    this.setPoster(this.poster);
  },
});
