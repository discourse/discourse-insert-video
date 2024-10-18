import Component from "@ember/component";
import { alias } from "@ember/object/computed";
import UppyUploadMixin from "discourse/mixins/uppy-upload";

export default Component.extend(UppyUploadMixin, {
  type: "vtt",
  addDisabled: alias("uploading"),
  classNameBindings: [":simple-list-uploader"],
  id: "vtt-uploader",

  uploadDone({ url }) {
    this.refresh(url);
  },
});
