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
    buttons: [
        {
            text: text,
            color: {
                red: 0,
                green: 0.4,
                blue: 1,
                alpha: 1
            },
            onClick: {
                openLink: {
                    url
                }
            }
        }
    ]
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
        cardsV2: [
            {
                cardId: "unique-card-id",
                card: {
                    sections: [
                        {
                            widgets: [
                                {
                                    columns: {
                                        columnItems: [
                                            {
                                                horizontalSizeStyle: "FILL_AVAILABLE_SPACE",
                                                horizontalAlignment: "START",
                                                verticalAlignment: "CENTER",
                                                widgets: [
                                                    {
                                                        textParagraph: {
                                                            text: `<b>${name} <font color=${statusColorPalette[status]} >${statusText[status]}</font></b>`

                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            header: "Repository",
                            widgets: [
                                {
                                    columns: {
                                        columnItems: [
                                            {
                                                horizontalSizeStyle: "FILL_AVAILABLE_SPACE",
                                                verticalAlignment: "CENTER",
                                                widgets: [
                                                    {
                                                        decoratedText: {
                                                            icon: {
                                                                knownIcon: "BOOKMARK"
                                                            },
                                                            text:
                                                                `${owner}/${repo}`

                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                horizontalSizeStyle: "FILL_AVAILABLE_SPACE",
                                                horizontalAlignment: "END",
                                                verticalAlignment: "CENTER",
                                                widgets: [
                                                    {
                                                        buttonList: textButton("Open repository", repoUrl)
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            header: "Event name",
                            widgets: [
                                {
                                    columns: {
                                        columnItems: [
                                            {
                                                horizontalSizeStyle: "FILL_AVAILABLE_SPACE",
                                                verticalAlignment: "CENTER",
                                                widgets: [
                                                    {
                                                        decoratedText: {
                                                            icon: {
                                                                knownIcon: "HOTEL_ROOM_TYPE"
                                                            },
                                                            text: eventName
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                horizontalSizeStyle: "FILL_AVAILABLE_SPACE",
                                                horizontalAlignment: "END",
                                                verticalAlignment: "CENTER",
                                                widgets: [
                                                    {
                                                        buttonList: textButton("Open event", eventUrl)
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            header: "Reference name",
                            widgets: [
                                {
                                    columns: {
                                        columnItems: [
                                            {
                                                horizontalSizeStyle: "FILL_AVAILABLE_SPACE",
                                                verticalAlignment: "CENTER",
                                                widgets: [
                                                    {
                                                        decoratedText: {
                                                            icon: {
                                                                knownIcon: "DESCRIPTION"
                                                            },
                                                            text: ref
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            widgets: [
                                {
                                    columns: {
                                        columnItems: [
                                            {
                                                horizontalSizeStyle: "FILL_AVAILABLE_SPACE",
                                                horizontalAlignment: "CENTER",
                                                verticalAlignment: "CENTER",
                                                widgets: [
                                                    {
                                                        buttonList: textButton("Open checks", checksUrl)
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }

            }
        ],
    };

    console.info(`Sending request with body ${JSON.stringify(body)}`);

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