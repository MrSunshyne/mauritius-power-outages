<template>
  <div class="wrapper">
    <div id="wrapper">
      <div id="bulb">
        <div id="bulb-top"></div>
        <div id="bulb-middle"></div>
        <div id="bulb-bottom"></div>
      </div>
      <div id="bulb-base">
        <div id="bulb-base-top"></div>
        <div id="bulb-base-middle">
          <div class="rivet rivet-short"></div>
          <div class="rivet rivet-long"></div>
          <div class="rivet rivet-short"></div>
          <div class="rivet rivet-long"></div>
          <div class="rivet rivet-short"></div>
        </div>
        <div id="bulb-base-bottom"></div>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
$size: 100px;
$bulb: #f59e0b;
$base: #999999;

.wrapper {
  position: relative;
}

#wrapper {

  color: $bulb;
  position: absolute;
  left: calc(50% - #{$size * .5});
  top: calc(50% - #{$size * 1.3 * .5});
  height: $size * 1.3;
  width: $size;
}

#bulb {
  position: relative;
  width: inherit;
  height: inherit;
  transition: color 400ms linear;
  filter: drop-shadow(0 0 20px currentColor);
  z-index: 1;
}

#bulb-top {
  border-radius: 50%;
  background: radial-gradient(circle at $size/2 $size/2, lighten($bulb, 30%) 0%, currentColor 40%, currentColor 80%, transparent 100%);
  //filter: drop-shadow(0 0 20px currentColor);
  width: $size;
  height: $size;
}

#bulb-middle {
  border-top: $size/2 solid currentColor;
  border-left: $size/4 solid transparent;
  border-right: $size/4 solid transparent;
  position: absolute;
  height: 0;
  bottom: 2px;
  width: $size/1.2;
  left: calc(50% - #{$size}/2.4);
  //filter: drop-shadow(0 0 20px currentColor);
}

#bulb-bottom {
  background-color: currentColor;
  border-radius: 50%;
  position: absolute;
  height: $size/3;
  width: $size/2;
  left: calc(50% - #{$size}/4);
  bottom: 0;
  //filter: drop-shadow(0 0 20px currentColor);
}

#bulb-base {
  color: $base;
  position: absolute;
  height: $size/3;
  width: $size;
  bottom: -1 * ($size/3.7);
  z-index: 2;
  overflow: hidden;
}

#bulb-base-top {
  background: linear-gradient(to bottom, #bbb 20%, #555 100%);
  border-radius: 0 0 3px 3px;
  position: relative;
  height: $size/16;
  width: $size/2.5;
  left: calc(50% - #{$size}/5);
}

.rivet {
  position: relative;
}

.rivet-short {
  background-color: hsl(100, 0%, 40%);
  border-top: 3px solid hsl(100, 0%, 20%);
  height: $size/48;
  width: $size/3;
  left: calc(50% - #{$size}/6);
}

.rivet-long {
  background: linear-gradient(to bottom, #aaa 20%, #555 100%);
  border-radius: 3px;
  height: $size/32;
  width: $size/2.5;
  left: calc(50% - #{$size}/5);
}

#bulb-base-bottom {
  border-top: $size/8 solid $base;
  border-left: $size/7 solid transparent;
  border-right: $size/7 solid transparent;

  position: relative;
  width: $size/8;
  left: calc(50% - #{$size}/7);
}
</style>