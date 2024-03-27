import Component from "@ember/component";
import { action } from "@ember/object";
import { alias } from "@ember/object/computed";
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
  updatePoster(event) {
    this.set("poster", event.target.value);
    this.setPoster(this.poster);
  },
});
