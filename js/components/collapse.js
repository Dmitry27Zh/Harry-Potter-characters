import { addTargetEventListener } from '../utils/events.js'

const Attribute = {
  TOGGLE: 'data-collapse-toggle',
  SECTION: 'data-collapse-section',
  CONTAINER: 'data-collapse',
  GROUP: 'data-collapse-group',
  COLLAPSED_STATE: 'data-collapsed',
  CLOSE_NESTED: 'data-close-nested',
  EXPAND_ONLY: 'data-expand-only',
}

const Classname = {
  TOGGLE: 'collapse__toggle',
  SECTION: 'collapse__section',
  NO_TRANSITION: 'no-transition',
  READY_TRANSITION: 'collapse-transition',
}

class Collapse {
  constructor() {
    this.elementsMap = new WeakMap()
    this.groupToToggles = new WeakMap()
    this.sections = document.getElementsByClassName(Classname.SECTION)
    this.init()
  }

  toggleView(toggle, isCollapse, hasTransition) {
    const isCollapsedNow = this.isCollapsed(toggle)
    isCollapse = isCollapse == null ? !isCollapsedNow : isCollapse

    if (isCollapsedNow === isCollapse) {
      return
    }

    const { sections, container, parentSection, group } = this.getElements(toggle)

    if (group) {
      this.toggleGroup(parentSection, group, isCollapse)
    }

    sections.forEach((section) => {
      hasTransition = hasTransition == null ? !section.classList.contains(Classname.NO_TRANSITION) : hasTransition

      if (hasTransition) {
        this.toggleSection(section, isCollapse)
      }
    })

    toggleElementsState(toggle, sections, container, isCollapse)
  }

  toggleViewEvery(toggles, isCollapse, hasTransition) {
    toggles.forEach((toggle) => this.toggleView(toggle, isCollapse, hasTransition))
  }

  toggleViewForMediaQuery(toggles, mediaQuery, isCollapse) {
    const toggleView = () => {
      if (mediaQuery.matches) {
        this.toggleViewEvery(toggles, isCollapse, false)
      }
    }

    toggleView()
    mediaQuery.addListener(toggleView)
  }

  init() {
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest(`[${Attribute.TOGGLE}]`)

      if (!toggle) {
        return
      }

      e.preventDefault()
      this.toggleView(toggle)
    })

    setTimeout(() => document.documentElement.classList.add(Classname.READY_TRANSITION))
  }

  toggleGroup(parentSection, group, isCollapse) {
    if (group.matches(`[${Attribute.EXPAND_ONLY}]`) && !isCollapse) {
      const toggles = this.groupToToggles.get(group)

      const collapsingToggles = [].filter.call(
        toggles,
        (toggle) => parentSection === this.getElements(toggle).parentSection
      )

      this.toggleViewEvery(collapsingToggles, true)
    }
  }

  toggleSection(section, isCollapse) {
    if (!isCollapse) {
      expandSection(section)
      return
    }

    if (section.matches(`[${Attribute.CLOSE_NESTED}]`)) {
      this.collapseNested(section)
    }

    collapseSection(section)
  }

  collapseNested(section) {
    const nestedToggles = section.querySelectorAll(`[${Attribute.TOGGLE}]`)
    nestedToggles.forEach((toggle) => this.toggleView(toggle, true))
  }

  getElements(toggle) {
    const id = toggle.getAttribute(Attribute.TOGGLE)

    if (!this.elementsMap.has(toggle)) {
      this.setElements(toggle, id)
    }

    const elements = this.elementsMap.get(toggle)

    if (id) {
      elements.sections = [].filter.call(this.sections, (section) => section.matches(`[${Attribute.SECTION}=${id}]`))
    } else {
      elements.sections = [].filter.call(elements.sections, (section) => {
        return section.closest(`[${Attribute.CONTAINER}]`) === elements.container
      })
    }

    return elements
  }

  setElements(toggle, id) {
    let container, sections, parentSection, isNested, group

    if (!id) {
      container = toggle.closest(`[${Attribute.CONTAINER}]`)
      sections = container.getElementsByClassName(Classname.SECTION)
    }

    parentSection = toggle.closest(`[${Attribute.SECTION}]`)
    isNested = !!parentSection
    group = toggle.closest(`[${Attribute.GROUP}]`)

    if (group && !this.groupToToggles.has(group)) {
      const togglesInGroup = group.getElementsByClassName(Classname.TOGGLE)
      this.groupToToggles.set(group, togglesInGroup)
    }

    this.elementsMap.set(toggle, {
      container,
      sections,
      parentSection,
      isNested,
      group,
    })
  }

  isCollapsed = isCollapsed
}

export const collapse = new Collapse()

function toggleElementsState(toggle, sections, container, isCollapsed) {
  toggle.dataset.collapsed = isCollapsed
  sections.forEach((section) => (section.dataset.collapsed = isCollapsed))

  if (container) {
    container.dataset.collapsed = isCollapsed
  }
}

function collapseSection(section) {
  const sectionHeight = section.scrollHeight
  section.style.height = `${sectionHeight}px`

  requestAnimationFrame(() => {
    section.style.height = null
  })
}

function expandSection(section) {
  const sectionHeight = section.scrollHeight
  section.style.height = `${sectionHeight}px`

  addTargetEventListener(
    section,
    'transitionend',
    () => {
      if (!isCollapsed(section)) {
        section.style.height = null
      }
    },
    { bubbles: false }
  )
}

function isCollapsed(element) {
  return !element.hasAttribute(Attribute.COLLAPSED_STATE) || element.getAttribute(Attribute.COLLAPSED_STATE) === 'true'
}
