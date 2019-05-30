<script>
  export let item;
</script>

<style>
  .item {
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
  }
  .item-head {
    display: flex;
    flex-direction: row;
  }
  .item-feed {
    padding-right: 20px;
  }
  .item-link {
    flex: 1;
    padding-right: 20px;
  }
  .item-content {
    padding-top: 10px;
  }
  .item-date {
  }
</style>

<div class="item">
  <div class="item-head">
    <div class="item-feed">
      <a href={item.feed.link}>{item.feed.title}</a>
    </div>
    <a class="item-link" href={item.link}>{item.title}</a>
    <div class="item-date"> {new Date(item.isoDate).toLocaleString()} </div>
  </div>
  <details class="item-content">
    <summary>{item.contentSnippet.slice(0, 20)}</summary>
    {@html item.content}
  </details>
</div>
