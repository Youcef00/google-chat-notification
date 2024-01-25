import * as github from '@actions/github';
import * as axios from 'axios';
import {Status} from './status';

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
    text: text,
    onClick: {openLink: {url}}
});

export async function notify(name: string, url: string, status: Status) {
    const {owner, repo} = github.context.repo;
    const {eventName, sha, ref} = github.context;
    const {number} = github.context.issue;
    const repoUrl = `https://github.com/${owner}/${repo}`;
    const eventPath = eventName === 'pull_request' ? `/pull/${number}` : `/commit/${sha}`;
    const eventUrl = `${repoUrl}${eventPath}`;
    const checksUrl = `${repoUrl}${eventPath}/checks`;

    const body = {
        "cardsV2": [
            {
                "cardId": "unique-card-id",
                "card": {
                    "header": {
                        "title": "Sasha",
                        "subtitle": "Software Engineer",
                        "imageUrl":
                            "https://developers.google.com/chat/images/quickstart-app-avatar.png",
                        "imageType": "CIRCLE",
                        "imageAltText": "Avatar for Sasha",
                    },
                    "sections": [
                        {
                            "header": "Contact Info",
                            "uncollapsibleWidgetsCount": 1,
                            "widgets": [
                                {
                                    "decoratedText": {
                                        "startIcon": {
                                            "knownIcon": "EMAIL",
                                        },
                                        "text": "sasha@example.com",
                                    }
                                },
                                {
                                    "decoratedText": {
                                        "startIcon": {
                                            "knownIcon": "PERSON",
                                        },
                                        "text": "<font color=\"#80e27e\">Online</font>",
                                    },
                                },
                                {
                                    "decoratedText": {
                                        "startIcon": {
                                            "knownIcon": "PHONE",
                                        },
                                        "text": "+1 (555) 555-1234",
                                    }
                                },
                                {
                                    "buttonList": {
                                        "buttons": [
                                            {
                                                "text": "Share",
                                                "onClick": {
                                                    "openLink": {
                                                        "url": "https://example.com/share",
                                                    }
                                                }
                                            },
                                            {
                                                "text": "Edit",
                                                "onClick": {
                                                    "action": {
                                                        "function": "goToView",
                                                        "parameters": [
                                                            {
                                                                "key": "viewType",
                                                                "value": "EDIT",
                                                            }
                                                        ],
                                                    }
                                                }
                                            },
                                        ],
                                    }
                                },
                            ],
                        },
                    ],
                },
            }
        ],
    };

    console.info(`Sending request with body ${JSON.stringify(body)}`);

    let response;
    try {
        response = await axios.default.post(url,body);
        console.log('Google Chat notification sent successfully.');
    } catch (error) {
        console.error('Error sending Google Chat notification:', error);
        throw error;
    }
    if (response !== undefined && response.status !== 200) {
        throw new Error(`Google Chat notification failed. Response status: ${response.status}`);
    }

}