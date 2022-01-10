import { alias } from "@ember/object/computed";
import Component from "@ember/component";
import UppyUploadMixin from "discourse/mixins/uppy-upload";

export default Component.extend(UppyUploadMixin, {
  type: "vtt",
  addDisabled: alias("uploading"),
  classNameBindings: [":simple-list-uploader"],

  uploadDone({ url }) {
    this.refresh(url);
  },
});
