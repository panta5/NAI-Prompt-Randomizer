# Requirements

-   Node.JS 20 or above
-   Git
-   Project dependencies (package.json)

# Installation Guide

```bash
# Linux or MacOS

git clone https://github.com/panta5/NAI-Prompt-Randomizer.git

cd NAI-Prompt-Randomizer

chmod +x dl-linux.sh && ./dl-linux.sh

npm install
```

```bash
# Windows

git clone https://github.com/panta5/NAI-Prompt-Randomizer.git

cd NAI-Prompt-Randomizer

dl-windows.bat

npm install
```

```bash
# Using Default PORT

node index.js

# Using Custom PORT (e.g. 7860)

PORT=7860 node index.js
```

# Docker

Docker Support! (use Dockerfile)

# Welcome to Prombot (original)

Automatic prompt generator for Novel AI image generator!

Try it out at [prombot.net](https://prombot.net/)

## Getting Started

Follow these steps to start using Prombot:

-   **Clone the repository.**
-   **Run the following command to start the application:**
    ```bash
    sudo node index.js
    ```

## Configuration Options

![1.png](/images/EN/1.png)
**Beginning Prompt**
Prompt to put in front of generated prompt.

**Prompt Search Options**
Find random prompt that includes certain tags. Put "~" in front of a tag to exclude certain tags.

**Remove Artist**
Remove artist names from generated prompt.

**Remove Character**
Remove certain character's name and characteristics of generated prompt.

**Ending Prompt**
Prompt to put at the end of generated prompt.

![2.png](/images/EN/2.png)

**Automation Options**

-   **Delay**: Delay for automatic image generation (8 seconds recommended to prevent bans).
-   **Enable Automation**: Enables automatic image generation.
-   **Automatically Download**: Automatically download images after generation.

![3.png](/images/EN/3.png)
**Generation History**
Click to view image generation history (disappears on page refresh).

![4.png](/images/EN/4.png)
**Prompt Information**
Hover the cursor on the image to view generated prompt informations.

## Prompt Generation

![8.png](/images/EN/8.png)
**Prombot** automatically finds a random prompt that satisfies tag requirements on **Prompt Search Options**. Then it removes duplicate tags in the random prompt. Lastly, it combines the random prompt with **Beginning Prompt** and **Ending Prompt**.

## Logic

![5.png](/images/EN/5.png)
_Image Generation Logic_

![6.png](/images/EN/6.png)
_Server Structure_

![7.png](/images/EN/7.png)
_Login Structure_

## License

This project is licensed under the MIT License.
