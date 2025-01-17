<template>
  <section class="px-4 flex flex-col flex-1 justify-center transition-opacity">
    <div class="mt-4 lg:mt-8 w-full max-w-xl mx-auto">
      <h3 class="leading-tight text-2xl font-bold text-gray-900">
        Merci ! L'organisme certificateur va revenir très vite vers vous !
      </h3>

      <fieldset class="mt-4">
        <p>Pour cela, nous avons besoin de vos coordonnées :</p>
        <legend class="sr-only">Pré-bilan</legend>
        <div class="flex flex-col mt-8 bg-white rounded-md">
          <!-- Checked: "bg-indigo-50 border-indigo-200 z-10", Not Checked: "border-gray-200" -->
          <p class="block">E-mail :</p>
          <input
            v-model="candidate.email"
            class="
              mt-2
              focus:ring-indigo-500 focus:border-indigo-500
              block
              w-full
              shadow-sm
              px-4
              py-2
              border-gray-100 border
              rounded
            "
            type="email"
            name="email"
            placeholder="john.doe@mail.com"
            required="true"
          />
        </div>
        <div class="flex flex-col mt-4 bg-white rounded-md">
          <!-- Checked: "bg-indigo-50 border-indigo-200 z-10", Not Checked: "border-gray-200" -->
          <p class="block">Prénom :</p>
          <input
            v-model="candidate.firstname"
            class="
              mt-2
              focus:ring-indigo-500 focus:border-indigo-500
              block
              w-full
              shadow-sm
              px-4
              py-2
              border-gray-100 border
              rounded
            "
            type="text"
            name="firstname"
            placeholder="John"
            required="true"
          />
        </div>
        <div class="flex flex-col mt-4 bg-white rounded-md">
          <!-- Checked: "bg-indigo-50 border-indigo-200 z-10", Not Checked: "border-gray-200" -->
          <p class="block">Nom :</p>
          <input
            v-model="candidate.lastname"
            class="
              mt-2
              focus:ring-indigo-500 focus:border-indigo-500
              block
              w-full
              shadow-sm
              px-4
              py-2
              border-gray-100 border
              rounded
            "
            type="text"
            name="lastname"
            placeholder="Doe"
            required="true"
          />
        </div>
        <div class="flex flex-col mt-4 bg-white rounded-md">
          <!-- Checked: "bg-indigo-50 border-indigo-200 z-10", Not Checked: "border-gray-200" -->
          <p class="block">Numéro de téléphone :</p>
          <input
            v-model="candidate.phoneNumber"
            class="
              mt-2
              focus:ring-indigo-500 focus:border-indigo-500
              block
              w-full
              shadow-sm
              px-4
              py-2
              border-gray-100 border
              rounded
            "
            type="tel"
            name="phoneNumber"
            placeholder="0600110011"
            pattern="[0-9]{10}"
            required="true"
          />
        </div>
        <p v-if="hasError" class="mt-4 text-red-600 text-sm">
          Une erreur est survenue lors de l'enregistrement des données.
        </p>
      </fieldset>
    </div>
    <div
      class="
        flex flex-col
        md:flex-row
        items-center
        py-12
        w-full
        max-w-xl
        mx-auto
        mt-4
        justify-center
        md:justify-end
      "
    >
      <Button :disabled="!isValideCandidate" @click="register">
        Terminer</Button
      >
    </div>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  useRoute,
  useRouter,
  watch,
} from '@nuxtjs/composition-api'
import * as yup from 'yup'

const schema = yup.object().shape({
  email: yup.string().email().required(),
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Numéro de téléphone invalide.'),
})

export default defineComponent({
  name: 'Register',
  props: {
    hasError: {
      type: Boolean,
      default: false,
    },
  },
  setup(_props, { emit }) {
    const candidate = reactive({
      email: '',
      firstname: '',
      lastname: '',
      phoneNumber: '',
    })
    const isValideCandidate = ref(false)

    const register = () => {
      emit('submit', candidate)
    }

    const router = useRouter()
    const route = useRoute()
    const routeValue = computed(() => route.value)

    router.push({
      path: routeValue.value.path,
      query: {
        ...routeValue.value.query,
        step: 'user-form',
        questionId: undefined,
      },
    })

    watch(candidate, async () => {
      const isValid = await schema.isValid(candidate)
      isValideCandidate.value = isValid
    })
    return { candidate, register, isValideCandidate }
  },
})
</script>
