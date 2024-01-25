import * as github from '@actions/github';
import * as axios from 'axios';
import { Status } from './status';

const statusColorPalette: { [key in Status]: string } = {
  success: "#2cbe4e",
  cancelled: "#ffc107",
  failure: "#ff0000"
};

const statusText: { [key in Status]: string } = {
  success: "Succeeded",
  cancelled: "Cancelled",
  failure: "Failed"
};

const textButton = (text: string, url: string) => ({
  textButton: {
    text,
    onClick: { openLink: { url } }
  }
});

export async function notify(name: string, url: string, status: Status) {
  const { owner, repo } = github.context.repo;
  const { eventName, sha, ref } = github.context;
  const { number } = github.context.issue;
  const repoUrl = `https://github.com/${owner}/${repo}`;
  const eventPath = eventName === 'pull_request' ? `/pull/${number}` : `/commit/${sha}`;
  const eventUrl = `${repoUrl}${eventPath}`;
  const checksUrl = `${repoUrl}${eventPath}/checks`;

  const body = {
    cardsV2: [{
      sections: [
        {
          widgets: [{
            textParagraph: {
              text: `<b>${name} <span style="color:${statusColorPalette[status]}">${statusText[status]}</span></b>`
            }
          }]
        },
        {
          widgets: [
            {
              keyValue: {
                topLabel: "repository",
                content: `${owner}/${repo}`,
                contentMultiline: true,
                button: textButton("OPEN REPOSITORY", repoUrl)
              }
            },
            {
              keyValue: {
                topLabel: "event name",
                content: eventName,
                button: textButton("OPEN EVENT", eventUrl)
              }
            },
            {
              keyValue: { topLabel: "ref", content: ref }
            }
          ]
        },
        {
          widgets: [{
            buttons: [textButton("OPEN CHECKS", checksUrl)]
          }]
        }
      ]
    }]
  };

  let response;
  try {
    response = await axios.default.post(url, body);
    console.log('Google Chat notification sent successfully.');
  } catch (error) {
    console.error('Error sending Google Chat notification:', error);
    throw error;
  }
  if (response !== undefined && response.status !== 200) {
    throw new Error(`Google Chat notification failed. Response status: ${response.status}`);
  }

}