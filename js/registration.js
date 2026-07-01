export function isSupabaseConfigured(config) {
  const registrationConfig = config?.registration ?? {};
  return Boolean(
    registrationConfig.supabaseUrl &&
      registrationConfig.supabaseAnonKey &&
      registrationConfig.tableName
  );
}

export function buildRegistrationPayload(formValues, config) {
  const registrationConfig = config?.registration ?? {};
  const companions = Number.parseInt(formValues.companions, 10);
  const data = {
    name: formValues.name?.trim() ?? "",
    surname: formValues.surname?.trim() ?? "",
    email: formValues.email?.trim() ?? "",
    attending: formValues.attending === "si",
    companions: Number.isFinite(companions) ? companions : 0,
    needs_bus: formValues.needsBus === "si",
    notes: formValues.notes?.trim() ?? "",
    created_at: new Date().toISOString()
  };

  if (companions > 0) {
    const companionName = formValues.companionName?.trim();
    const companionSurname = formValues.companionSurname?.trim();

    if (companionName) {
      data.companion_name = companionName;
    }
    if (companionSurname) {
      data.companion_surname = companionSurname;
    }
  }

  Object.keys(data).forEach((key) => {
    if (data[key] === "") {
      delete data[key];
    }
  });

  return {
    tableName: registrationConfig.tableName,
    data
  };
}

export async function submitRegistration(formValues, config) {
  const registrationConfig = config?.registration ?? {};

  if (!isSupabaseConfigured(config)) {
    throw new Error("Faltan las variables de Supabase en la configuración.");
  }

  const payload = buildRegistrationPayload(formValues, config);
  const response = await fetch(`${registrationConfig.supabaseUrl}/rest/v1/${payload.tableName}`, {
    method: "POST",
    headers: {
      apikey: registrationConfig.supabaseAnonKey,
      Authorization: `Bearer ${registrationConfig.supabaseAnonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(payload.data)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`No se pudo guardar la inscripción: ${response.status} ${errorText}`);
  }

  return { ok: true };
}
