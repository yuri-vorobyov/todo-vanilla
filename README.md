# todo-vanilla

The cliché project for all those starting their journey to become a frontend developer. And I'm not an exception. So here it is:

https://yuri-vorobyov.github.io/todo-vanilla/

User can add, remove, edit, and of course check/uncheck tasks. List of tasks is saved to the [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) so that its state is preserved even after browser gets refreshed. Each todo item is a [web component](https://developer.mozilla.org/en-US/docs/Web/Web_Components), which incapsulates the corresponding functionality and fires [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) in responce to user's interactions.
