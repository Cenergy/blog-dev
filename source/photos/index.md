---
title: 相册
date: 2020-12-30 19:04:03
layout: photo
comment: 'waline'
---

<style>
#imageTab{
  margin-top:-1.5rem;
}
.ImageGrid {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  text-align: center;
}
.card {
  overflow: hidden;
  transition: .3s ease-in-out;
  border-radius: 8px;
  background-color: #efefef;
  padding: 1.4px;
}
.ImageInCard img {
  padding: 0;
  border-radius: 8px;
  width:100%;
  height:100%;
}
.photo-tabs{
    /* border-top: 1px solid #e4e7ed; */
    /* -moz-column-gap:0.8rem; 
    -webkit-column-gap:0.8rem; 
    column-gap:0.8rem; */
}
.photo-tab{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: #e1eaf7;
    /* background: background: linear-gradient(118deg,rgba(50,100,200,1),rgba(50,100,200,.7))!important; */
    border-radius: 50%;
    text-align: center;
    cursor: pointer;
    color: #606266;
    font-size: 0.8rem;
    transition: box-shadow 0.35s, -webkit-transform 0.35s;
    transition: transform 0.35s, box-shadow 0.35s;
    transition: transform 0.35s, box-shadow 0.35s, -webkit-transform 0.35s;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-right:0.8rem;
    margin-top:0.8rem;
}

.photo-tab:hover {
    -webkit-transform: translate3d(0, -3px, 0);
    transform: translate3d(0, -3px, 0);
    box-shadow: 0 5px 5px rgba(0,0,0,0.1);
}
@media (prefers-color-scheme: dark) {
  .card {background-color: #333;}
}
</style>

<div id="imageTab"></div>
<div class="ImageGrid"></div>
