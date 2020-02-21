import { alias } from "@ember/object/computed";
import Component from "@ember/component";
import UploadMixin from "discourse/mixins/upload";

export default Component.extend(UploadMixin, {
  type: "vtt",
  addDisabled: alias("uploading"),
  elementId: "vtt-uploader",

  uploadDone({ url }) {
    this.refresh(url);
  }
});
