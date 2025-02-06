import Component from "@glimmer/component";
import { getOwner } from "@ember/owner";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import ConditionalLoadingSpinner from "discourse/components/conditional-loading-spinner";
import icon from "discourse/helpers/d-icon";
import UppyUpload from "discourse/lib/uppy/uppy-upload";

export default class VttUploader extends Component {
  uppyUpload = new UppyUpload(getOwner(this), {
    type: "vtt",
    id: "vtt-uploader",
    uploadDone: ({ url }) => {
      this.args.refresh(url);
    },
  });

  get addDisabled() {
    return this.uppyUpload.uploading;
  }

  <template>
    <div class="simple-list-uploader">
      <label class="btn {{if this.addDisabled 'disabled'}}">
        {{icon "upload"}}
        <input
          {{didInsert this.uppyUpload.setup}}
          class="hidden-upload-field"
          disabled={{this.addDisabled}}
          type="file"
          accept="text/vtt"
        />
      </label>
      <ConditionalLoadingSpinner @condition={{this.addDisabled}} />
    </div>
  </template>
}
