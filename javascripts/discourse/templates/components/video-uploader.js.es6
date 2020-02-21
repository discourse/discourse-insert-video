import { alias } from "@ember/object/computed";
import Component from "@ember/component";
import UploadMixin from "discourse/mixins/upload";

export default Component.extend(UploadMixin, {
  type: "mp4",
  addDisabled: alias("uploading"),
  elementId: "video-uploader",

  uploadDone({ url }) {
    this.refresh(url);
  }
});
