<script setup lang="ts">
import { themes } from "@/libs/themes";

const { availableLocales, locale } = useI18n();
const theme = useStorage("theme", usePreferredColorScheme().value);
const html = ref<HTMLElement | null>(null);

const changeTheme = (paramTheme: string) => {
  if (html.value) {
    html.value.dataset.theme = paramTheme;
    theme.value = paramTheme;
  }
};

const changeLocale = (localeParam: string) => {
  locale.value = localeParam;
};

onMounted(async () => {
  await nextTick();
  html.value = document.querySelector("html") as HTMLElement;
  if (html.value) {
    if (theme.value) {
      html.value.dataset.theme = theme.value;
    }
  }
});
</script>

<template>
  <header>
    <nav
      class="w-full bg-white text-gray-800 py-4 px-8 shadow-md dark:shadow-md flex items-center border-b border-gray-400/50"
    >
      <router-link :to="{ name: 'home' }">
        <div class="font-bold lg:text-xl md:text-lg text-md">Animo</div>
      </router-link>
      <div class="ml-auto flex items-center h-full">
        <div class="dropdown">
          <label tabindex="0" class="btn btn-primary">Theme</label>
          <ul
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li
              v-for="theme in themes"
              @click="changeTheme(theme.value)"
              :key="theme.label"
            >
              <a tabIndex="0" data-set-theme="dark" data-act-class="active" className="">
                {{ theme.label }}
              </a>
            </li>
          </ul>
        </div>

        <div class="dropdown dropdown-end mx-5">
          <label tabindex="0" class="btn btn-info btn-square">{{ locale }}</label>
          <ul
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li
              v-for="locale in availableLocales"
              :key="locale"
              @click="changeLocale(locale)"
            >
              <a tabIndex="0" data-set-theme="dark" data-act-class="active" className="">
                {{ locale }}
              </a>
            </li>
          </ul>
        </div>

        <!-- <button class="mx-5 cursor-pointer focus:outline-none" @click="toggleDarkMode">
          <icon:bx:bx-moon class="w-6 h-6" v-if="!isDark" />
          <icon:bx:bxs-moon class="w-6 h-6" v-else />
        </button>
        <a href="https://github.com/zynth17/vitailse">
          <icon-akar-icons:github-fill />
        </a> -->
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
