<template>
  <div class="space-y-6 lg:space-y-8">
    <!-- Header moderne avec gradient subtil et responsive -->
    <div
      class="relative overflow-hidden rounded-xl lg:rounded-2xl bg-gradient-to-br from-base-100 via-primary/5 to-secondary/5 border border-base-200/50 p-4 lg:p-6"
    >
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--p),0.03),transparent_50%)]"
      ></div>
      <div class="relative z-10">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0">
          <div class="flex items-center gap-3 lg:gap-4">
            <div
              class="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-md"
            >
              <svg
                class="w-5 h-5 lg:w-6 lg:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <h2
                class="text-xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                {{ t('activities.title') }}
              </h2>
              <p
                class="text-sm lg:text-base text-base-content/70 mt-1 flex flex-wrap items-center gap-2"
              >
                <span>{{ t('activities.subtitle') }}</span>
                <span v-if="totalActivities > 0" class="badge badge-primary badge-sm font-medium">
                  {{ totalActivities }} {{ t('activities.total') }}
                </span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 lg:gap-3">
            <!-- Bouton de rafraîchissement -->
            <button
              class="btn btn-ghost btn-sm btn-square transition-all duration-200 hover:scale-110"
              :class="{ loading: loading }"
              :disabled="loading"
              @click="loadActivities"
              :title="t('activities.refresh')"
            >
              <svg
                v-if="!loading"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            <!-- Bouton d'ajout rapide fun avec dropdown -->
            <div class="dropdown dropdown-bottom dropdown-end">
              <div
                tabindex="0"
                role="button"
                class="btn btn-primary btn-sm gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span class="hidden sm:inline">{{ t('activities.quickAdd') }}</span>
                <svg
                  class="w-3 h-3 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <ul
                tabindex="0"
                class="dropdown-content menu bg-base-100 rounded-xl z-[9999] w-56 p-2 shadow-2xl border border-base-200"
                style="position: absolute; top: 100%; right: 0; margin-top: 0.5rem"
              >
                <li>
                  <a
                    @click="createActivity('CALL')"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <ActivityIcon type="CALL" size="sm" class="text-primary" />
                    </div>
                    <div>
                      <div class="font-medium">{{ t('activities.types.call') }}</div>
                      <div class="text-xs text-base-content/60">
                        {{ t('activities.types.callDesc') }}
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    @click="createActivity('MEETING')"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/10 transition-colors"
                  >
                    <div
                      class="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center"
                    >
                      <ActivityIcon type="MEETING" size="sm" class="text-secondary" />
                    </div>
                    <div>
                      <div class="font-medium">{{ t('activities.types.meeting') }}</div>
                      <div class="text-xs text-base-content/60">
                        {{ t('activities.types.meetingDesc') }}
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    @click="createActivity('EMAIL')"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div class="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <ActivityIcon type="EMAIL" size="sm" class="text-accent" />
                    </div>
                    <div>
                      <div class="font-medium">{{ t('activities.types.email') }}</div>
                      <div class="text-xs text-base-content/60">
                        {{ t('activities.types.emailDesc') }}
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    @click="createActivity('TASK')"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-info/10 transition-colors"
                  >
                    <div class="w-8 h-8 rounded-lg bg-info/20 flex items-center justify-center">
                      <ActivityIcon type="TASK" size="sm" class="text-info" />
                    </div>
                    <div>
                      <div class="font-medium">{{ t('activities.types.task') }}</div>
                      <div class="text-xs text-base-content/60">
                        {{ t('activities.types.taskDesc') }}
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    @click="createActivity('NOTE')"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-warning/10 transition-colors"
                  >
                    <div class="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
                      <ActivityIcon type="NOTE" size="sm" class="text-warning" />
                    </div>
                    <div>
                      <div class="font-medium">{{ t('activities.types.note') }}</div>
                      <div class="text-xs text-base-content/60">
                        {{ t('activities.types.noteDesc') }}
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistiques modernes et ludiques -->
    <div class="space-y-4">
      <!-- Indication de filtrage avec style moderne -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-base-100 rounded-xl p-4 border border-base-200/50"
      >
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-base-content/70">
            {{ t('activities.filterByType') }}
          </span>
          <div v-if="selectedActivityTypes.size > 0" class="flex items-center gap-2">
            <span class="badge badge-primary badge-sm font-medium animate-pulse">
              {{ selectedActivityTypes.size }} {{ t('activities.typesSelected') }}
            </span>
            <button
              class="btn btn-ghost btn-xs gap-1 hover:bg-error/10 hover:text-error transition-colors"
              @click="clearTypeFilters"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {{ t('activities.clearTypes') }}
            </button>
          </div>
        </div>
        <div class="text-xs text-base-content/50 flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ t('activities.clickToFilter') }}
        </div>
      </div>

      <!-- Cartes de statistiques modernes et responsive -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        <div
          class="stat bg-base-100 rounded-lg border border-base-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="{
            'ring-2 ring-primary bg-primary/5': selectedActivityTypes.has('CALL'),
            'hover:bg-base-200': !selectedActivityTypes.has('CALL'),
          }"
          @click="toggleActivityTypeFilter('CALL')"
        >
          <div class="stat-figure text-primary">
            <ActivityIcon type="CALL" size="lg" />
          </div>
          <div class="stat-title text-xs">{{ t('activities.types.call') }}</div>
          <div
            class="stat-value text-lg font-medium"
            :title="`${activityCounts.calls || 0} ${t('activities.types.call').toLowerCase()}`"
          >
            {{ formatNumber(activityCounts.calls || 0) }}
          </div>
        </div>

        <div
          class="stat bg-base-100 rounded-lg border border-base-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="{
            'ring-2 ring-secondary bg-secondary/5': selectedActivityTypes.has('MEETING'),
            'hover:bg-base-200': !selectedActivityTypes.has('MEETING'),
          }"
          @click="toggleActivityTypeFilter('MEETING')"
        >
          <div class="stat-figure text-secondary">
            <ActivityIcon type="MEETING" size="lg" />
          </div>
          <div class="stat-title text-xs">{{ t('activities.types.meeting') }}</div>
          <div
            class="stat-value text-lg font-medium"
            :title="`${activityCounts.meetings || 0} ${t('activities.types.meeting').toLowerCase()}`"
          >
            {{ formatNumber(activityCounts.meetings || 0) }}
          </div>
        </div>

        <div
          class="stat bg-base-100 rounded-lg border border-base-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="{
            'ring-2 ring-accent bg-accent/5': selectedActivityTypes.has('EMAIL'),
            'hover:bg-base-200': !selectedActivityTypes.has('EMAIL'),
          }"
          @click="toggleActivityTypeFilter('EMAIL')"
        >
          <div class="stat-figure text-accent">
            <ActivityIcon type="EMAIL" size="lg" />
          </div>
          <div class="stat-title text-xs">{{ t('activities.types.email') }}</div>
          <div
            class="stat-value text-lg font-medium"
            :title="`${activityCounts.emails || 0} ${t('activities.types.email').toLowerCase()}`"
          >
            {{ formatNumber(activityCounts.emails || 0) }}
          </div>
        </div>

        <div
          class="stat bg-base-100 rounded-lg border border-base-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="{
            'ring-2 ring-info bg-info/5': selectedActivityTypes.has('TASK'),
            'hover:bg-base-200': !selectedActivityTypes.has('TASK'),
          }"
          @click="toggleActivityTypeFilter('TASK')"
        >
          <div class="stat-figure text-info">
            <ActivityIcon type="TASK" size="lg" />
          </div>
          <div class="stat-title text-xs">{{ t('activities.types.task') }}</div>
          <div
            class="stat-value text-lg font-medium"
            :title="`${activityCounts.tasks || 0} ${t('activities.types.task').toLowerCase()}`"
          >
            {{ formatNumber(activityCounts.tasks || 0) }}
          </div>
        </div>

        <div
          class="stat bg-base-100 rounded-lg border border-base-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="{
            'ring-2 ring-warning bg-warning/5': selectedActivityTypes.has('NOTE'),
            'hover:bg-base-200': !selectedActivityTypes.has('NOTE'),
          }"
          @click="toggleActivityTypeFilter('NOTE')"
        >
          <div class="stat-figure text-warning">
            <ActivityIcon type="NOTE" size="lg" />
          </div>
          <div class="stat-title text-xs">{{ t('activities.types.note') }}</div>
          <div
            class="stat-value text-lg font-medium"
            :title="`${activityCounts.notes || 0} ${t('activities.types.note').toLowerCase()}`"
          >
            {{ formatNumber(activityCounts.notes || 0) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <ActivityFilters
      v-if="showFilters"
      :filters="filters"
      @update:filters="handleFiltersUpdate"
      @reset="resetFilters"
      style="border: 2px solid red; background: yellow"
    />

    <!-- Liste des activités -->
    <div class="space-y-6">
      <!-- En-tête de liste moderne et responsive -->
      <div class="bg-base-100 rounded-xl border border-base-200/50 overflow-hidden">
        <!-- Tabs responsive avec scroll horizontal -->
        <div
          class="tabs tabs-bordered bg-base-200/30 p-1 overflow-x-auto scrollbar-hide border-b border-base-200/50"
        >
          <a
            class="tab tab-sm transition-all duration-200 whitespace-nowrap min-w-fit font-medium"
            :class="{
              'tab-active bg-primary text-primary-content shadow-sm': activeTab === 'all',
              'hover:bg-base-200/50': activeTab !== 'all',
            }"
            @click="setActiveTab('all')"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            {{ t('activities.tabs.all') }}
          </a>
          <a
            class="tab tab-sm transition-all duration-200 whitespace-nowrap min-w-fit font-medium"
            :class="{
              'tab-active bg-warning text-warning-content shadow-sm': activeTab === 'pending',
              'hover:bg-base-200/50': activeTab !== 'pending',
            }"
            @click="setActiveTab('pending')"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ t('activities.tabs.pending') }}
          </a>
          <a
            class="tab tab-sm transition-all duration-200 whitespace-nowrap min-w-fit font-medium"
            :class="{
              'tab-active bg-success text-success-content shadow-sm': activeTab === 'completed',
              'hover:bg-base-200/50': activeTab !== 'completed',
            }"
            @click="setActiveTab('completed')"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ t('activities.tabs.completed') }}
          </a>
          <a
            class="tab tab-sm transition-all duration-200 whitespace-nowrap min-w-fit font-medium"
            :class="{
              'tab-active bg-error text-error-content shadow-sm': activeTab === 'overdue',
              'hover:bg-base-200/50': activeTab !== 'overdue',
            }"
            @click="setActiveTab('overdue')"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {{ t('activities.tabs.overdue') }}
          </a>

          <!-- Bouton Plus avec menu -->
          <div class="dropdown dropdown-end ml-auto" ref="moreMenuRef">
            <div
              tabindex="0"
              role="button"
              class="tab tab-sm transition-all duration-200 whitespace-nowrap min-w-fit font-medium flex items-center gap-1 hover:bg-base-200/70"
              :class="{
                'bg-base-200/70': true,
              }"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
              <span class="hidden sm:inline">{{ t('activities.more') }}</span>
              <!-- Badge si des filtres sont actifs -->
              <div v-if="hasActiveFilters" class="badge badge-primary badge-xs animate-pulse"></div>
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu bg-base-100 rounded-xl z-[9999] w-64 p-2 shadow-2xl border border-base-200"
              style="position: absolute; top: 100%; right: 0; margin-top: 0.5rem"
            >
              <!-- Section Tri -->
              <li class="menu-title">
                <span class="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                  {{ t('activities.sort.title') }}
                </span>
              </li>
              <li>
                <div class="flex items-center gap-2 p-2">
                  <select
                    v-model="sortBy"
                    class="select select-bordered select-sm bg-base-100 flex-1"
                  >
                    <option value="createdAt">{{ t('activities.sort.dateSort') }}</option>
                    <option value="dueDate">{{ t('activities.sort.dueDateSort') }}</option>
                    <option value="priority">{{ t('activities.sort.prioritySort') }}</option>
                    <option value="type">{{ t('activities.sort.typeSort') }}</option>
                  </select>
                  <button
                    class="btn btn-ghost btn-sm btn-square transition-all duration-200 hover:scale-110"
                    :title="
                      sortOrder === 'asc'
                        ? t('activities.sort.descending')
                        : t('activities.sort.ascending')
                    "
                    @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
                  >
                    <svg
                      class="w-4 h-4 transition-transform duration-300"
                      :class="{ 'rotate-180': sortOrder === 'desc' }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                      />
                    </svg>
                  </button>
                </div>
              </li>

              <!-- Séparateur -->
              <div class="divider my-1"></div>

              <!-- Section Filtres -->
              <li class="menu-title">
                <span class="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                  {{ t('activities.filters.title') }}
                </span>
              </li>
              <li>
                <a
                  @click="toggleFiltersAndCloseMenu"
                  class="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  {{ t('activities.filters.advanced') }}
                  <div v-if="hasActiveFilters" class="badge badge-primary badge-xs ml-auto"></div>
                </a>
              </li>

              <!-- Séparateur -->
              <div class="divider my-1"></div>

              <!-- Section Actions -->
              <li class="menu-title">
                <span class="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                  {{ t('activities.actions.title') }}
                </span>
              </li>
              <li>
                <a
                  @click="resetFiltersAndCloseMenu"
                  class="flex items-center gap-2 p-2 rounded-lg hover:bg-warning/10 text-warning transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {{ t('activities.filters.reset') }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Chargement avec animation -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="flex flex-col items-center gap-4">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="text-base-content/70">{{ t('activities.loading') }}</p>
          </div>
        </div>

        <!-- Liste vide moderne -->
        <div
          v-else-if="activities.length === 0"
          class="text-center py-16 bg-base-100 rounded-2xl border border-base-200/50"
        >
          <div
            class="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center"
          >
            <svg
              class="h-10 w-10 lg:h-12 lg:w-12 text-base-content/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold mb-2">{{ t('activities.empty.title') }}</h3>
          <p class="text-base-content/70 mb-6 max-w-md mx-auto px-4">
            {{ t('activities.empty.description') }}
          </p>
          <button
            class="btn btn-primary btn-sm gap-2 hover:scale-105 transition-transform duration-200"
            @click="createActivity('TASK')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {{ t('activities.empty.createFirst') }}
          </button>
        </div>

        <!-- Activités avec grille responsive -->
        <div v-else class="grid gap-4">
          <ActivityCard
            v-for="activity in activities"
            :key="activity.id"
            :activity="activity"
            @edit="editActivity"
            @delete="deleteActivity"
            @duplicate="duplicateActivity"
            @complete="completeActivity"
          />
        </div>

        <!-- Pagination moderne -->
        <div v-if="totalPages > 1" class="flex justify-center">
          <div class="join bg-base-100 rounded-xl shadow-sm border border-base-200/50">
            <button
              class="join-item btn btn-sm transition-all duration-200 hover:scale-105"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              «
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              class="join-item btn btn-sm transition-all duration-200 hover:scale-105"
              :class="{ 'btn-active': page === currentPage }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
            <button
              class="join-item btn btn-sm transition-all duration-200 hover:scale-105"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <dialog ref="activityModal" class="modal">
      <div class="modal-box max-w-5xl">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <!-- Formulaires spécialisés -->
        <CallForm
          v-if="showActivityForm && selectedActivityType === 'CALL'"
          :key="`call-${formKey}`"
          :activity="editingActivity"
          :available-users="availableUsers"
          :is-edit-mode="!!editingActivity"
          @save="saveActivity"
          @cancel="closeModal"
        />

        <MeetingForm
          v-if="showActivityForm && selectedActivityType === 'MEETING'"
          :key="`meeting-${formKey}`"
          :activity="editingActivity"
          :available-users="availableUsers"
          :is-edit-mode="!!editingActivity"
          @save="saveActivity"
          @cancel="closeModal"
        />

        <EmailForm
          v-if="showActivityForm && selectedActivityType === 'EMAIL'"
          :key="`email-${formKey}`"
          :activity="editingActivity"
          :available-users="availableUsers"
          :is-edit-mode="!!editingActivity"
          @save="saveActivity"
          @cancel="closeModal"
        />

        <TaskForm
          v-if="showActivityForm && selectedActivityType === 'TASK'"
          ref="taskFormRef"
          :key="`task-${formKey}`"
          :activity="editingActivity"
          :available-users="availableUsers"
          :is-edit-mode="!!editingActivity"
          @save="saveActivity"
          @cancel="closeModal"
        />

        <NoteForm
          v-if="showActivityForm && selectedActivityType === 'NOTE'"
          :key="`note-${formKey}`"
          :activity="editingActivity"
          :available-users="availableUsers"
          :is-edit-mode="!!editingActivity"
          @save="saveActivity"
          @cancel="closeModal"
        />
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ActivityService } from '@/services/activity.service'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import type {
  Activity,
  ActivityCounts,
  ActivityFiltersPaginated,
  ActivityType,
  ActivityUIFilters,
  CreateActivityDto,
  UpdateActivityDto,
} from '@/types/activity.types'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ActivityCard from './ActivityCard.vue'
import ActivityFilters from './ActivityFilters.vue'
import ActivityIcon from './ActivityIcon.vue'
import CallForm from './forms/CallForm.vue'
import EmailForm from './forms/EmailForm.vue'
import MeetingForm from './forms/MeetingForm.vue'
import NoteForm from './forms/NoteForm.vue'
import TaskForm from './forms/TaskForm.vue'

const { t } = useI18n()
const toast = useToastStore()
const userStore = useUserStore()

// Props
const props = defineProps<{
  companyId?: string
  contactId?: string
}>()

// État local
const activities = ref<Activity[]>([])
const loading = ref(false)
const showFilters = ref(false)
const editingActivity = ref<Activity | null>(null)
const activityModal = ref<HTMLDialogElement>()
const taskFormRef = ref<{ resetSubmissionState: () => void; resetForm: () => void } | null>(null)
const selectedActivityType = ref<ActivityType>('TASK')
const showActivityForm = ref(false)
const formKey = ref(0)

// Filtres par type d'activité (via les cartes)
const selectedActivityTypes = ref<Set<ActivityType>>(new Set())

// Tabs et tri
const activeTab = ref('all')
const sortBy = ref('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const totalActivities = ref(0)

// Filtres
const filters = ref<ActivityUIFilters>({
  type: '',
  assignedToId: '',
  startDate: '',
  endDate: '',
  priority: '',
  callOutcome: '',
  emailStatus: '',
  period: '',
  progressMin: '',
  progressMax: '',
})

// Statistiques
const activityCounts = ref<ActivityCounts>({
  total: 0,
  calls: 0,
  meetings: 0,
  tasks: 0,
  emails: 0,
  notes: 0,
})

// Computed
const totalPages = computed(() => Math.ceil(totalActivities.value / pageSize.value))

const availableUsers = computed(() => userStore.users)

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const hasActiveFilters = computed(() => {
  return (
    Object.values(filters.value).some(
      (value) => value !== '' && value !== null && value !== undefined,
    ) || selectedActivityTypes.value.size > 0
  )
})

// Watchers
watch(
  [filters, currentPage, activeTab, sortBy, sortOrder, selectedActivityTypes],
  () => {
    loadActivities()
  },
  { deep: true },
)

// Lifecycle
onMounted(() => {
  loadActivities()
  loadActivityCounts()
  userStore.fetchUsers()
})

// Méthodes
async function loadActivities() {
  loading.value = true
  try {
    const activityFilters: ActivityFiltersPaginated = {
      companyId: props.companyId,
      contactId: props.contactId,
      page: currentPage.value,
      limit: pageSize.value,
    }

    // Convertir les filtres UI en filtres service
    if (selectedActivityTypes.value.size > 0) {
      activityFilters.type = Array.from(selectedActivityTypes.value)
      console.log('Types sélectionnés:', activityFilters.type)
    }
    if (filters.value.assignedToId) {
      activityFilters.assignedToId = filters.value.assignedToId
    }
    if (filters.value.startDate && filters.value.endDate) {
      activityFilters.dateRange = {
        start: filters.value.startDate,
        end: filters.value.endDate,
      }
    }
    if (filters.value.priority) {
      activityFilters.priority = filters.value.priority
    }
    if (filters.value.callOutcome) {
      activityFilters.callOutcome = filters.value.callOutcome
    }
    if (filters.value.emailStatus) {
      activityFilters.emailStatus = filters.value.emailStatus
    }
    // Gestion des filtres de progression
    if (filters.value.progressMin) {
      activityFilters.progressMin = parseInt(filters.value.progressMin)
    }
    if (filters.value.progressMax) {
      activityFilters.progressMax = parseInt(filters.value.progressMax)
    }

    // Filtrer par statut selon l'onglet actif
    const statusFilter = getStatusFromTab()
    if (statusFilter) {
      activityFilters.status = statusFilter
    }

    const response = await ActivityService.getActivitiesPaginated(activityFilters)

    console.log('Filtres appliqués:', activityFilters)
    console.log('Réponse API:', response)

    activities.value = response.data
    totalActivities.value = response.total
  } catch (error) {
    console.error('Erreur lors du chargement des activités:', error)

    const errorMessage = error instanceof Error ? error.message : String(error)

    if (errorMessage === 'SESSION_EXPIRED') {
      toast.info(t('auth.sessionExpired'))
      return
    } else {
      toast.error(t('activities.loadError'))
    }
  } finally {
    loading.value = false
  }
}

async function loadActivityCounts() {
  try {
    const counts = await ActivityService.getActivityCounts({
      companyId: props.companyId,
      contactId: props.contactId,
    })
    activityCounts.value = counts
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
}

function getStatusFromTab(): string[] | undefined {
  switch (activeTab.value) {
    case 'pending':
      return ['pending', 'in_progress']
    case 'completed':
      return ['completed']
    case 'overdue':
      return ['overdue']
    default:
      return undefined
  }
}

function setActiveTab(tab: string) {
  activeTab.value = tab
  currentPage.value = 1
}

function createActivity(type: ActivityType) {
  editingActivity.value = null
  selectedActivityType.value = type
  showActivityForm.value = true
  formKey.value++

  // Réinitialiser le formulaire si c'est une tâche
  if (type === 'TASK' && taskFormRef.value) {
    taskFormRef.value.resetForm()
  }

  activityModal.value?.showModal()
}

function editActivity(activity: Activity) {
  editingActivity.value = activity
  // Validation du type d'activité
  const validTypes: ActivityType[] = ['CALL', 'MEETING', 'TASK', 'EMAIL', 'NOTE']
  if (validTypes.includes(activity.type as ActivityType)) {
    selectedActivityType.value = activity.type as ActivityType
  } else {
    console.warn("Type d'activité invalide:", activity.type)
    selectedActivityType.value = 'TASK' // Type par défaut
  }
  showActivityForm.value = true
  formKey.value++
  activityModal.value?.showModal()
}

async function deleteActivity(activity: Activity) {
  if (!confirm(t('activities.deleteConfirm', { title: activity.title }))) {
    return
  }

  try {
    await ActivityService.deleteActivity(activity.id)
    toast.success(t('activities.deleteSuccess'))
    loadActivities()
    loadActivityCounts()
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    toast.error(t('activities.deleteError'))
  }
}

async function duplicateActivity(activity: Activity) {
  try {
    await ActivityService.duplicateActivity(activity.id)
    toast.success(t('activities.duplicateSuccess'))
    loadActivities()
    loadActivityCounts()
  } catch (error) {
    console.error('Erreur lors de la duplication:', error)
    toast.error(t('activities.duplicateError'))
  }
}

async function completeActivity(activity: Activity) {
  try {
    await ActivityService.completeActivity(activity.id)
    toast.success(t('activities.completeSuccess'))
    loadActivities()
    loadActivityCounts()
  } catch (error) {
    console.error('Erreur lors de la completion:', error)
    toast.error(t('activities.completeError'))
  }
}

async function saveActivity(data: CreateActivityDto | UpdateActivityDto) {
  try {
    console.log('Données reçues du formulaire:', data)
    console.log('Mode édition:', !!editingActivity.value)
    console.log("Type d'activité sélectionné:", selectedActivityType.value)

    if (editingActivity.value) {
      await ActivityService.updateActivity(editingActivity.value.id, data as UpdateActivityDto)
      toast.success(t('activities.updateSuccess'))
    } else {
      const createData = {
        ...(data as CreateActivityDto),
        type: selectedActivityType.value,
        companyId: props.companyId,
        contactId: props.contactId,
      }
      console.log("Données finales envoyées à l'API:", createData)
      await ActivityService.createSpecializedActivity(createData)
      toast.success(t('activities.createSuccess'))
    }

    closeModal()
    loadActivities()
    loadActivityCounts()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    toast.error(editingActivity.value ? t('activities.updateError') : t('activities.createError'))
  } finally {
    // Réinitialiser l'état de soumission et le formulaire si c'était une création de tâche
    if (selectedActivityType.value === 'TASK' && taskFormRef.value) {
      taskFormRef.value.resetSubmissionState()
      if (!editingActivity.value) {
        taskFormRef.value.resetForm()
      }
    }
  }
}

function closeModal() {
  activityModal.value?.close()
  editingActivity.value = null
  showActivityForm.value = false
}

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function resetFilters() {
  filters.value = {
    type: '',
    assignedToId: '',
    startDate: '',
    endDate: '',
    priority: '',
    callOutcome: '',
    emailStatus: '',
    period: '',
    progressMin: '',
    progressMax: '',
  }
  selectedActivityTypes.value.clear()
  selectedActivityTypes.value = new Set()
  currentPage.value = 1
}

// Gérer la mise à jour des filtres depuis le composant ActivityFilters
function handleFiltersUpdate(newFilters: ActivityUIFilters) {
  Object.assign(filters.value, newFilters)
}

// Gestion des filtres par type d'activité via les cartes
function toggleActivityTypeFilter(type: ActivityType) {
  if (selectedActivityTypes.value.has(type)) {
    selectedActivityTypes.value.delete(type)
  } else {
    selectedActivityTypes.value.add(type)
  }
  // Force reactivity update
  selectedActivityTypes.value = new Set(selectedActivityTypes.value)
  currentPage.value = 1
}

function clearTypeFilters() {
  selectedActivityTypes.value.clear()
  selectedActivityTypes.value = new Set()
  currentPage.value = 1
}

// Fonction pour formater les grands nombres
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// Gérer l'ouverture/fermeture du menu "Plus"
const moreMenuRef = ref<HTMLDivElement | null>(null)

function toggleFiltersAndCloseMenu() {
  console.log('Avant toggle - showFilters:', showFilters.value)
  showFilters.value = !showFilters.value
  console.log('Après toggle - showFilters:', showFilters.value)
  // Fermer le dropdown en retirant l'attribut open
  if (moreMenuRef.value) {
    moreMenuRef.value.removeAttribute('open')
  }
}

function resetFiltersAndCloseMenu() {
  resetFilters()
  // Fermer le dropdown en retirant l'attribut open
  if (moreMenuRef.value) {
    moreMenuRef.value.removeAttribute('open')
  }
}
</script>

<style scoped>
/* Masquer la scrollbar pour une meilleure expérience mobile */
.scrollbar-hide {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

/* Améliorer l'expérience tactile sur mobile */
@media (max-width: 768px) {
  .tabs .tab {
    min-width: 80px;
    padding: 0.5rem 0.75rem;
  }

  .stat {
    padding: 0.75rem;
  }

  .stat-value {
    font-size: 1rem;
  }
}

/* Styles pour le bouton Plus dans les tabs */
.tabs .tab[role='button'] {
  border: none;
  background: transparent;
  height: auto;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tabs .tab[role='button']:hover {
  background-color: hsl(var(--b2) / 0.7);
}

/* Correction du décalage sur grand écran */
@media (min-width: 1024px) {
  .tabs .tab[role='button'] {
    min-height: 2.75rem;
  }
}

/* Animation pour le badge des filtres actifs */
@keyframes pulse-badge {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.badge.animate-pulse {
  animation: pulse-badge 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Forcer l'affichage des dropdowns au-dessus de tout */
.dropdown-content {
  z-index: 9999 !important;
  position: absolute !important;
}

/* S'assurer que les dropdowns ne sont pas cachés par d'autres éléments */
.dropdown {
  position: relative;
}

.dropdown .dropdown-content {
  pointer-events: auto;
  visibility: visible;
  opacity: 1;
}
</style>
