export const creatorChapters = [
    {
        id: "beginning",
        title: "The Beginning",
        progressLabel: "Part 1 of 4",
        questions: [
            {
                label: "What’s your name?",
                field: "creator.name",
            },
            {
                label: "What’s your partner’s name?",
                field: "partner.name",
            },
            {
                label: "What do you call them when no one’s around?",
                field: "partner.nickname",
            },
        ],
    },
    {
        id: "journey",
        title: "The Journey",
        progressLabel: "Part 2 of 4",
        questions: [
            {
                label: "When did you first realize you cared about them?",
                field: "answers.realization",
            },
            {
                label: "One moment with them you’ll never forget?",
                field: "answers.memory",
            },
            {
                label: "A small thing they do that means a lot to you?",
                field: "answers.smallThing",
            },
        ],
    },
    {
        id: "secret",
        title: "The Secret",
        progressLabel: "Part 3 of 4",
        questions: [
            {
                label: "Something you’ve never said out loud?",
                field: "answers.secret",
            },
            {
                label: "What do you admire most about them?",
                field: "answers.admiration",
            },
        ],
    },
    {
        id: "promise",
        title: "The Promise",
        progressLabel: "Part 4 of 4",
        questions: [
            {
                label: "What do you promise them?",
                field: "answers.promise",
            },
            {
                label: "One line you want them to remember forever?",
                field: "answers.finalLine",
            },
        ],
    },
];
