import {
  Form,
  useLoaderData,
  useActionData,
  useTransition,
  useSubmit,
  Link,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type {
  LoaderFunction,
  MetaFunction,
  ActionFunction,
} from "@remix-run/node";

import { requireUser } from "~/utils/session.server";
import { Layout } from "~/components/layout";

import type { User } from "@prisma/client";

import {
  getAllUsersByAdmin,
  getUserRoleById,
  toggleUserRole,
  updatePasswordById,
} from "~/models/user.server";
import { useUser } from "~/utils/utils";

export const meta: MetaFunction = () => {
  return {
    title: `myKPop, KPOP, 케이팝, 마이케이팝`,
    description: `KPOP, 케이팝, 블랙핑크, BLACKPINK, 뉴진스, NewJeans, 르세라핌, LE SSERAFIM`,
  };
};

type MyActionData = {
  type: "success" | "error";
  message: string;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const actionType = form.get("_action");

  if (actionType === "reset-password") {
    const userId = form.get("userId") as string;
    const email = form.get("email") as string;
    const result = await updatePasswordById(userId, email);
    // console.log(result);
    if (result) {
      return {
        message: `Successfully resetted ${email}'s password to "${email}"`,
        type: "success",
      };
    } else {
      return {
        message: `Error happened when resetting ${email}'s password`,
        type: "error",
      };
    }
  }

  if (actionType === "change-role") {
    const userRole = form.get("userRole") as string;
    const userId = form.get("userId") as string;
    const email = form.get("email") as string;
    const currentUserId = form.get("currentUserId") as string;

    const currentUserRoleAsObject = await getUserRoleById(currentUserId);
    if (currentUserRoleAsObject?.role === "admin") {
      const result =
        userRole === "admin"
          ? await toggleUserRole(userId, "user")
          : await toggleUserRole(userId, "admin");

      if (result) {
        return {
          message: `Successfully changed Role of "${email}"`,
          type: "success",
        };
      } else {
        return {
          message: `Error happened when changing ${email}'s Role`,
          type: "error",
        };
      }
    }
  }

  return {};
};

type UserList = {
  id: User["id"];
  email: User["email"];
  role: User["role"];
  _count: {
    notes: number;
  };
};

type MyLoaderData = {
  userId: string;
  userList: UserList[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  if (user && user.role === "admin") {
    const userId = user.id;
    const userList = (await getAllUsersByAdmin(user?.id)) as UserList[];
    // console.log(userList);

    return json<MyLoaderData>({ userId, userList });
  }

  return redirect("/");
};

export default function AdminPage() {
  const user = useUser();
  let data = useLoaderData<typeof loader>();
  let actionData = useActionData() as MyActionData;
  const mySubmit = useSubmit();
  const transition = useTransition();
  const isChangeRole =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "change-role";

  const handleChange = (event: any) => {
    mySubmit(event.currentTarget, { replace: true });
  };

  return (
    <Layout>
      {user.role === "admin" && (
        <Link
          className="rounded bg-red-100 px-2.5 py-0.5 text-center text-xs font-semibold text-red-800 dark:bg-red-200 dark:text-red-900"
          to="artist"
        >
          Go to Artist
        </Link>
      )}

      {actionData && (
        <p className="rounded bg-red-100 px-2.5 py-0.5 text-center text-sm font-semibold text-red-800 dark:bg-red-200 dark:text-red-900">
          {actionData.message}
        </p>
      )}

      <div className="relative w-full overflow-x-auto p-4 shadow-md sm:rounded-lg lg:w-10/12">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                email
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>

              <th scope="col" className="px-6 py-3">
                Reset
              </th>
              <th scope="col" className="px-6 py-3">
                Activity
              </th>
            </tr>
          </thead>
          <tbody>
            {data.userList.map((m: any) => (
              <tr
                key={m.id}
                className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 odd:dark:bg-gray-800 even:dark:bg-gray-700"
              >
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                >
                  {m.email}
                </th>
                <td className="px-6 py-4">
                  {isChangeRole &&
                  transition.submission.formData.get("userId") === m.id
                    ? "..."
                    : m.role}
                  <Form
                    replace
                    method="post"
                    className="mt-2 -ml-2"
                    onChange={handleChange}
                  >
                    <input type="hidden" name="currentUserId" value={user.id} />
                    <input type="hidden" name="email" value={m.email} />
                    <input type="hidden" name="userRole" value={m.role} />
                    <input type="hidden" name="userId" value={m.id} />
                    <input type="hidden" name="_action" value="change-role" />
                    <label
                      htmlFor={m.id}
                      className="relative inline-flex cursor-pointer items-center"
                    >
                      <input
                        type="checkbox"
                        id={m.id}
                        className="peer sr-only"
                        checked={m.role === "admin" ? true : false}
                        onChange={handleChange}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                    </label>
                  </Form>
                </td>

                <td className="px-6 py-4">
                  <Form method="post" replace>
                    <input
                      type="hidden"
                      name="_action"
                      value="reset-password"
                    />
                    <input type="hidden" name="userId" value={m.id} />
                    <input type="hidden" name="email" value={m.email} />
                    <button type="submit" className="text-blue-500">
                      Reset
                    </button>
                  </Form>
                </td>
                <td className="px-6 py-4">Notes: {m._count.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
