import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "uuid";

let storedTweets = JSON.parse(localStorage.getItem("feedData")) || tweetsData;

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.dataset.replyBtn) {
    handleTweetReplyClick(e.target.dataset.replyBtn);
  } else if (e.target.dataset.delete) {
    handleTweetDeleteClick(e.target.dataset.delete);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  }
});

function handleTweetDeleteClick(tweetId) {
  const tweetIndex = storedTweets.findIndex(function (tweet) {
    return tweet.uuid === tweetId;
  });

  if (tweetIndex > -1) {
    storedTweets.splice(tweetIndex, 1);
    render();
  }
}

function handleTweetReplyClick(replyId) {
  const replyInput = document.getElementById(`reply-input-${replyId}`);

  if (replyInput.value) {
    const targetTweetObj = storedTweets.filter(function (tweet) {
      return tweet.uuid === replyId;
    })[0];

    targetTweetObj.replies.push({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      tweetText: replyInput.value,
    });

    render();
    document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
    replyInput.value = "";
  }
}

function handleLikeClick(tweetId) {
  const targetTweetObj = storedTweets.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = storedTweets.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    storedTweets.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    render();
    tweetInput.value = "";
  }
}

function getFeedHtml() {
  let feedHtml = ``;

  storedTweets.forEach(function (tweet) {
    let likeIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`;
      });
    }

    repliesHtml += `
<div class="tweet-reply">
  <div class="tweet-inner">
    <img src="images/scrimbalogo.png" class="profile-pic">
    <div>
      <p class="handle">@Scrimba</p>
      <textarea rows="2" cols="10" placeholder="Tweet your reply" class="tweet-text" id="reply-input-${tweet.uuid}"></textarea>
      <button class="btn" data-reply-btn="${tweet.uuid}">Reply</button>
    </div>
  </div>
</div>
`;

    feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash"
                    data-delete="${tweet.uuid}"
                    ></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`;
  });
  return feedHtml;
}

function render() {
  localStorage.setItem("feedData", JSON.stringify(storedTweets));
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
