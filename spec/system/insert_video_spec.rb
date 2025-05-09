# frozen_string_literal: true

require_relative "page_objects/modals/insert_video"

RSpec.describe "Inserting Video from Composer", system: true do
  fab!(:theme) { upload_theme_component }
  fab!(:user)
  let(:composer) { PageObjects::Components::Composer.new }
  let(:topic) { PageObjects::Pages::Topic.new }
  let(:insert_video_modal) { PageObjects::Modals::InsertVideo.new }

  before do
    Group.refresh_automatic_groups!
    sign_in(user)
  end

  it "should upload video" do
    SiteSetting.authorized_extensions += "|mp4|vtt"
    video_file =
      File.absolute_path(Pathname.new("#{__FILE__}/../../fixtures/media/sample_video.mp4"))
    poster_file =
      File.absolute_path(Pathname.new("#{__FILE__}/../../fixtures/images/poster_small.jpg"))
    subtitle_file =
      File.absolute_path(Pathname.new("#{__FILE__}/../../fixtures/media/sample_video.vtt"))

    visit "/new-topic"
    expect(composer).to be_opened
    topic.fill_in_composer_title("Video upload test")
    composer.click_toolbar_button("insertVideo")
    expect(insert_video_modal).to be_open

    # the relative order of the upload setup and assertions here should not
    # be changed:
    # 1. consecutively running 2 `attach_file` calls with custom-simple-list uploaders can
    # result in both files uploaded into a single value-list instead of two separate
    # value-lists: this happened when uploading the video_file first and then the
    # subtitle_file without assertions
    # 2. poster input assertion relies on the other input fields getting found by the Capybara
    # finder methods first before we assert against the poster input's value
    # (its actual text attribute is never updated in its current implementation)
    attach_file(subtitle_file) { insert_video_modal.click_add_subtitle_button }
    expect(insert_video_modal.subtitle_input_field[:title]).to include "vtt"
    attach_file(poster_file) { insert_video_modal.click_add_poster_button }
    attach_file(video_file) { insert_video_modal.click_add_video_source_button }
    expect(insert_video_modal.video_source_input_field[:title]).to include "mp4"
    expect(insert_video_modal.poster_input_field.value).to include ".jpeg"
    insert_video_modal.click_insert_video_button
    expect(insert_video_modal).to be_closed

    video_preview = composer.preview.find("video[controls][poster]")
    expect(video_preview).to be_visible
    expect(video_preview).to have_css('source[type="video/mp4"]', visible: false)
    expect(video_preview).to have_css('track[kind="subtitles"]', visible: false)
  end
end
