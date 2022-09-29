module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @use "@/assets/all.scss" as *;
        `,
      }
    }
  }
}