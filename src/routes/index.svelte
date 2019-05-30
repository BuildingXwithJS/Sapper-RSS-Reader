<script>
  import { onMount } from "svelte";
  import Article from "../components/Article.svelte";

  let showAddForm = false;
  let rssUrl = "https://news.ycombinator.com/rss";
  let rssList = [];
  let feedsContent = [];

  onMount(async () => {
    const newRssList = await fetch("/api/list").then(r => r.json());
    rssList = newRssList;
  });

  const refreshFeeds = async () => {
    const feeds = await fetch("/api/refresh").then(r => r.json());
    feedsContent = feeds
      .map(feed => {
        const { items, ...feedMeta } = feed;
        return items.map(item => ({ ...item, feed: feedMeta }));
      })
      .reduce((acc, val) => acc.concat(val), [])
      .sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));
  };

  const toggleAddForm = () => {
    showAddForm = !showAddForm;
  };

  const addRssToList = async () => {
    showAddForm = false;
    const { added, rssList: newRssList } = await fetch("/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: rssUrl })
    }).then(r => r.json());
    if (added) {
      rssList = newRssList;
      refreshFeeds();
    }
  };

  const removeFromList = async url => {
    const { removed, rssList: newRssList } = await fetch("/api/del", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    }).then(r => r.json());
    if (removed) {
      rssList = newRssList;
      refreshFeeds();
    }
  };
</script>

<style>
  .container {
    display: flex;
  }

  .feed-list {
    display: flex;
    padding: 10px;
    flex-direction: column;
  }

  .articles {
    display: flex;
    flex: 1;
    padding: 10px;
    flex-direction: column;
  }

  .add-feed {
    display: flex;
  }

  .feed-input {
    flex: 1;
  }

  .articles-actions {
    display: flex;
  }
</style>

<svelte:head>
  <title>Sapper RSS Reader</title>
</svelte:head>

{#if showAddForm}
  <div class="add-feed">
    <button on:click={toggleAddForm}>Cancel</button>
    <input
      class="feed-input"
      type="text"
      placeholder="http://rss.feed.com"
      bind:value={rssUrl} />
    <button on:click={addRssToList}>Add</button>
  </div>
{/if}

<div class="container">
  <div class="feed-list">
    <button on:click={toggleAddForm}>Add</button>
    <ul>
      {#each rssList as feed}
        <li>
           {feed}
          <button on:click={() => removeFromList(feed)}>Remove</button>
        </li>
      {/each}
    </ul>
  </div>
  <div class="articles">
    <div class="articles-actions">
      <button on:click={refreshFeeds}>Reload</button>
    </div>
    <div class="articles-list">
      {#each feedsContent as item}
        <Article {item} />
      {/each}
    </div>
  </div>
</div>
